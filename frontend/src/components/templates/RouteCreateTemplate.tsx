import { NaverMapProvider } from "../../util/maps/naver_map/context";
import NaverMap from "../../util/maps/naver_map/NaverMap";
import MarkerList from "../organisms/MarkerList";
import MapToggleButton from "../organisms/MapToggleButton";

import InputLabelComponent from "../atoms/Input/InputLabelComponent";
import InputTextTypeMolecule from "../molecules/InputTextTypeMolecule";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeAbleButton";

import { useRef } from "react";
import html2canvas from "html2canvas";
import canvg from "canvg";
import { saveAs } from "file-saver";

type OwnProps = {
  initPosition: { latitude: number; longitude: number };
  onSave: ({ polyline, title }: FormValues) => void;
};

type FormValues = {
  title: string;
  polyline: { latitude: number; longitude: number }[];
};

const RouteCreateTemplate: React.FC<OwnProps> = ({
  initPosition,
  onSave,
}: OwnProps) => {
  const schema = yup.object<FormValues>({
    polyline: yup.array().min(2, "2개 이상의 경유지를 선택해주세요"),
    title: yup
      .string()
      .max(50, "50글자 이내로 입력해주세요.")
      .required("경로의 제목을 입력해주세요."),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleSave(data.title);
    onSave(data);
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      polyline: [],
    },
  });

  const setPolyline = (polyline: { latitude: number; longitude: number }[]) => {
    setValue("polyline", polyline);
  };

  const captureRef = useRef<HTMLDivElement>(null);

  const handleSave = async (filename: string) => {
    if (captureRef.current) {
      const svgNodesToRemove: HTMLCanvasElement[] = [];

      const svgElements = document.body.querySelectorAll("svg");

      svgElements.forEach((item) => {
        const svg = item.outerHTML.trim();

        const canvas = document.createElement("canvas");

        canvas.width = item.getBoundingClientRect().width;
        canvas.height = item.getBoundingClientRect().height;

        canvg(canvas, svg);

        if (item.style.position) {
          canvas.style.position += item.style.position;
          canvas.style.left += item.style.left;
          canvas.style.top += item.style.top;
        }

        item.parentNode?.appendChild(canvas);

        svgNodesToRemove.push(canvas);
      });

      const canvas = await html2canvas(captureRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
      });
      canvas.toBlob(
        (blob) => {
          if (blob) {
            saveAs(blob, `${filename}.png`);
          }
        },
        "image/jpg",
        1
      );

      svgNodesToRemove.forEach(function (element) {
        element.remove();
      });
    }
  };

  return (
    <NaverMapProvider>
      <div className="mx-auto w-full max-w-[550px] pb-10">
        <div className="flex justify-center relative">
          <div ref={captureRef}>
            <NaverMap
              lng={initPosition.longitude}
              lat={initPosition.latitude}
              onChange={setPolyline}
            />
          </div>
          <div className="absolute bottom-0 right-4 p-4">
            <MapToggleButton />
          </div>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="polyline"
              control={control}
              render={() => (
                <>
                  <div className="flex justify-between">
                    <div className="flex">
                      <InputLabelComponent id={""} title={"경로 정보"} />
                      <p className="ps-4 pt-1 text-sm font-light text-red-500">
                        {errors.polyline?.message}
                      </p>
                    </div>
                  </div>
                  <MarkerList />
                </>
              )}
            />
            <div className="mt-8 mb-4">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputTextTypeMolecule
                    id="title"
                    title="제목*"
                    placeholder="ex) 한강 러닝"
                    {...field}
                    error={errors.title?.message}
                    hasError={!!errors.title}
                  />
                )}
              />
            </div>
            <div>
              {isValid ? (
                <LargeAbleButton text="저장하기" />
              ) : (
                <LargeDisableButton text="저장하기" />
              )}
            </div>
          </form>
        </div>
      </div>
    </NaverMapProvider>
  );
};

export default RouteCreateTemplate;
