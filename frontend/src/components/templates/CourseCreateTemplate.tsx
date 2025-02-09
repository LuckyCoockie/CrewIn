import NaverMap from "../../util/maps/naver_map/NaverMap";
import MarkerList from "../organisms/MarkerList";
import MapToggleButton from "../organisms/MapToggleButton";

import InputLabelComponent from "../atoms/Input/InputLabelComponent";
import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import canvg from "canvg";

import {
  DirectionDto,
  Point,
  directionApiWithWayPoints,
} from "../../apis/api/tmap/directionApi";
import {
  addMarker,
  updateMarkerList,
  addPolyline,
  clearPolyline,
  moveToCenter,
  useNaverMapDispatch,
  clearMarker,
  setMarkerVisibility,
} from "../../util/maps/naver_map/context";
import { debounce } from "lodash";
import Modal from "../molecules/ModalMolecules";

type OwnProps = {
  initPosition?: Point;
  initValue?: FormValues;
  editable?: boolean;
  onSave: (data: FormValues) => Promise<void>;
};

type FormValues = {
  title: string;
  markers: { title: string; point: Point }[];
  polylines?: Point[][];
  length?: number;
  image?: File;
};

const CourseCreateTemplate: React.FC<OwnProps> = ({
  initValue,
  initPosition,
  editable = true,
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
          title: yup.string().required(),
          point: yup.object().shape({
            latitude: yup.number().required(),
            longitude: yup.number().required(),
          }),
        })
      )
      .min(2, "2개 이상의 경유지를 선택해주세요")
      .required(),
    polylines: yup.array().of(
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
    ),
    length: yup.number(),
    image: yup.mixed(),
  });

  const dispatch = useNaverMapDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [ismarkerErrorModalOpen, setIsMarkerErrorModalOpen] =
    useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmit(true);
    const mapDim = captureRef.current!.getBoundingClientRect().width;
    dispatch(moveToCenter(mapDim));
    dispatch(clearPolyline());
    for (let i = 1; i < data.markers.length - 1; i++) {
      dispatch(setMarkerVisibility(i, false));
    }
    directionApiWithWayPoints(
      data.markers.map((marker) => marker.point),
      (direction) => {
        dispatch(addPolyline(direction.polyline));
      }
    ).then((directions) => {
      handleSave({
        ...data,
        polylines: directions.map((directoin) => directoin.polyline),
        length: directions.reduce(
          (sum, direction) => sum + direction.distance,
          0
        ),
      })?.then(() => {
        for (let i = 1; i < data.markers.length - 1; i++) {
          dispatch(setMarkerVisibility(i, true));
        }
      });
    });
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      markers: [],
    },
  });

  const setMarkers = useCallback(
    (markers: { title: string; point: Point }[], error?: string) => {
      setValue("markers", markers);
      if (error !== undefined) setIsMarkerErrorModalOpen(true);
    },
    [setValue]
  );

  const setPolylines = useCallback(
    (polylines?: Point[][]) => setValue("polylines", polylines),
    [setValue]
  );

  const setLength = useCallback(
    (length?: number) => setValue("length", length),
    [setValue]
  );

  const captureRef = useRef<HTMLDivElement>(null);

  const handleSave = debounce(async (data: FormValues) => {
    if (captureRef.current) {
      const svgNodesToRemove: HTMLCanvasElement[] = [];

      const polylineSvg = Array.from(
        document.body.querySelectorAll("svg")
      ).filter((svg) => svg.tagName !== "svg");

      polylineSvg.forEach((item) => {
        const svg = item.outerHTML.trim();

        const canvas = document.createElement("canvas");

        canvas.width = item.getBoundingClientRect().width;
        canvas.height = item.getBoundingClientRect().height;

        canvg(canvas, svg);

        if (item.style.position) {
          canvas.style.position = item.style.position;
          canvas.style.left = item.style.left;
          canvas.style.top = item.style.top;
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
            onSave({
              ...data,
              image: new File([blob], "image.png", { type: "image/png" }),
            }).then(() => setIsSubmit(false));
          }
        },
        "image/png",
        1
      );

      svgNodesToRemove.forEach((element) => {
        element.remove();
      });
    }
  }, 500);

  useEffect(() => {
    dispatch(clearMarker());
    dispatch(clearPolyline());
    if (!initValue) return;
    setValue("title", initValue.title);
    initValue?.markers?.forEach(({ title, point }) => {
      dispatch(
        addMarker({
          longitude: point.longitude,
          latitude: point.latitude,
          title: title,
          ondragend: editable ? () => dispatch(updateMarkerList()) : undefined,
        })
      );

      const mapDim = captureRef.current!.getBoundingClientRect().width;
      dispatch(moveToCenter(mapDim));
    });

    if (initValue?.polylines) {
      dispatch(clearPolyline());
      initValue.polylines.forEach((polyline) => {
        dispatch(addPolyline(polyline));
      });
    }

    setLength(initValue.length);
  }, [dispatch, editable, initValue, setLength, setValue]);

  const position = useMemo(
    () =>
      initPosition && {
        lat: initPosition!.latitude,
        lng: initPosition!.longitude,
      },
    [initPosition]
  );

  const handleToogle = useCallback(
    (directions?: DirectionDto[]) => {
      if (directions) {
        setPolylines(directions.map((directoin) => directoin.polyline));
        setLength(
          directions.reduce((sum, direction) => sum + direction.distance, 0)
        );
        const mapDim = captureRef.current!.getBoundingClientRect().width;
        dispatch(moveToCenter(mapDim));
      } else {
        setPolylines(undefined);
        setLength(undefined);
      }
    },
    [dispatch, setLength, setPolylines]
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[500px] pb-10">
        <div className="flex justify-center relative overflow-hidden">
          <div ref={captureRef}>
            <NaverMap
              initPosition={position}
              onChange={setMarkers}
              editable={editable}
            />
          </div>
          <div className="absolute bottom-0 right-4 p-4">
            {editable && !isSubmit && (
              <MapToggleButton
                style={{ background: "#FFFFFF", borderRadius: 9999 }}
                onToggle={handleToogle}
              />
            )}
          </div>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="markers"
              control={control}
              render={() => (
                <>
                  <div className="flex">
                    <InputLabelComponent id={""} title={"경로 정보"} />
                    <p className="ps-4 pt-1 text-sm font-light text-red-500">
                      {errors.markers?.message}
                    </p>
                    <Controller
                      name="length"
                      control={control}
                      render={(field) => (
                        <label className="justify-end ml-auto block min-h-[1.5rem] tracking-tighter">
                          {field.field.value &&
                            `예상 거리 : ${
                              field.field.value >= 1000
                                ? `${(field.field.value / 1000).toFixed(1)} km`
                                : `${field.field.value} m`
                            } `}
                        </label>
                      )}
                    />
                  </div>
                  <MarkerList editable={editable} />
                </>
              )}
            />
            <div className="mt-8 mb-4">
              <Controller
                name="title"
                control={control}
                render={({ field }) =>
                  editable ? (
                    <InputTextTypeMolecule
                      id="title"
                      title="제목*"
                      placeholder="ex) 한강 러닝"
                      {...field}
                      error={errors.title?.message}
                      hasError={!!errors.title}
                    />
                  ) : (
                    <div className="mb-4 w-full">
                      <InputLabelComponent title={"제목"} />

                      <div
                        className={`data-input bg-white border border-gray-300`}
                      >
                        {field.value}
                      </div>
                    </div>
                  )
                }
              />
            </div>
            <div>
              {editable && (
                <LargeAbleButton text="저장하기" isLoading={isSubmit} />
              )}
            </div>
          </form>
        </div>
        {ismarkerErrorModalOpen && (
          <Modal title="알림" onClose={() => setIsMarkerErrorModalOpen(false)}>
            <p>{"경유지는 최대 10개까지 지정가능합니다."}</p>
          </Modal>
        )}
      </div>
    </>
  );
};

export default CourseCreateTemplate;
