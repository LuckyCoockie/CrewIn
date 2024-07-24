import NaverMap from "../../util/maps/naver_map/NaverMap";
import MarkerList from "../organisms/MarkerList";
import MapToggleButton from "../organisms/MapToggleButton";

import InputLabelComponent from "../atoms/Input/InputLabelComponent";
import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeAbleButton";

import { useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import canvg from "canvg";

import { Point, directionApiWithWayPoints } from "../../util/maps/tmap/api";
import {
  addPolyline,
  clearPolyline,
  moveToCenter,
  useNaverMapDispatch,
} from "../../util/maps/naver_map/context";
import { uploadImage } from "../../apis/api/presigned";

type OwnProps = {
  initPosition: Point;
  onSave: ({ polylines, markers, title, image }: FormValues) => void;
};

type FormValues = {
  title: string;
  markers: Point[];
  polylines: Point[][];
  length: number;
  image: string;
};

const CourseCreateTemplate: React.FC<OwnProps> = ({
  initPosition,
  onSave,
}: OwnProps) => {
  const schema = yup.object().shape({
    title: yup
      .string()
      .max(50, "50글자 이내로 입력해주세요.")
      .required("경로의 제목을 입력해주세요."),
    markers: yup
      .array()
      .of(
        yup.object().shape({
          latitude: yup.number().required(),
          longitude: yup.number().required(),
        })
      )
      .min(2, "2개 이상의 경유지를 선택해주세요")
      .required(),
    polylines: yup
      .array()
      .of(
        yup
          .array()
          .of(
            yup
              .object()
              .shape({
                latitude: yup.number().required(),
                longitude: yup.number().required(),
              })
              .required()
          )
          .required()
      )
      .required(),
    length: yup.number().required(),
    image: yup.string().required(),
  });

  const dispatch = useNaverMapDispatch();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const mapDim = captureRef.current!.getBoundingClientRect().width;
    dispatch(moveToCenter(mapDim));
    dispatch(clearPolyline());
    const directions = await directionApiWithWayPoints(
      data.markers,
      (direction) => {
        dispatch(addPolyline(direction.polyline));
      }
    );
    setPolylines(directions.map((directoin) => directoin.polyline));
    setLength(
      directions.reduce((sum, direction) => sum + direction.distance, 0)
    );
    // TODO : 상세 정보 체크 되면 저장 하는거 고려해보기
    setTimeout(async () => {
      await handleSave();
      onSave(data);
    }, 500);
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
      title: "",
      markers: [],
    },
  });

  const setMarkers = useCallback(
    (markers: Point[]) => {
      setValue("markers", markers);
    },
    [setValue]
  );

  const setPolylines = useCallback(
    (polylines: Point[][]) => {
      setValue("polylines", polylines);
    },
    [setValue]
  );

  const setLength = useCallback(
    (length: number) => {
      setValue("length", length);
    },
    [setValue]
  );

  const setImage = useCallback(
    (image: string) => {
      setValue("image", image);
    },
    [setValue]
  );

  const captureRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
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
        async (blob) => {
          // TODO : upload file
          if (blob) {
            const file = new File([blob], "temp.png");
            const imageUrl = await uploadImage(file);
            setImage(imageUrl);
          }
        },
        "image/png",
        1
      );

      svgNodesToRemove.forEach((element) => {
        element.remove();
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[550px] pb-10">
      <div className="flex justify-center relative">
        <div ref={captureRef}>
          <NaverMap
            lng={initPosition.longitude}
            lat={initPosition.latitude}
            onChange={setMarkers}
          />
        </div>
        <div className="absolute bottom-0 right-4 p-4">
          <MapToggleButton />
        </div>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="markers"
            control={control}
            render={() => (
              <>
                <div className="flex justify-between">
                  <div className="flex">
                    <InputLabelComponent id={""} title={"경로 정보"} />
                    <p className="ps-4 pt-1 text-sm font-light text-red-500">
                      {errors.markers?.message}
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
  );
};

export default CourseCreateTemplate;
