import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import InputNumberTypeMolecule from "../molecules/Input/InputNumberTypeMolecule";
import ImageMultiTypeMolecule from "../molecules/Input/InputImageMultiTypeMolecule";
import InputDropdonwTypeMolecule from "../molecules/Input/InputDropdonwTypeMolecule";
import InputTextAreaNoLimitTypeMolecule from "../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputDateStartTypeMolecule from "../molecules/Input/InputDateStartTypeMolecule";
import InputDateEndTypeMolecule from "../molecules/Input/InputDateEndTypeMolecule";
import InputRadioTypeMolecule from "../molecules/Input/InputRadioTypeMolecule";
import Modal from "../molecules/ModalMolecules";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

import { pace } from "../../pace";
import {
  SessionCreateDto,
  postCreateSession,
} from "../../apis/api/sessioncreate";
import { uploadImage } from "../../apis/api/presigned";
import { getMyCrews, CrewDto } from "../../apis/api/mycrew";
import { getMapList } from "../../apis/api/mycourse";

const schema = yup.object({
  sessiontype: yup.string().required("세션 종류를 선택해주세요."),
  sessiontitle: yup
    .string()
    .max(30, "30글자 이내로 입력해주세요.")
    .required("세션명을 입력해주세요."),
  sessionmembers: yup
    .number()
    .typeError("숫자만 입력 가능합니다.")
    .min(1, "최소 본인 1명입니다.")
    .max(200, "최대인원은 200명입니다.")
    .required("인원수를 설정해주세요"),
  sessionposter: yup.mixed(),
  sessionstart: yup.date(),
  sessionend: yup
    .date()
    .required("종료시간을 입력해주세요.")
    .test(
      "is-greater",
      "종료시간은 시작시간보다 늦어야 합니다.",
      function (value) {
        const { sessionstart } = this.parent;
        return sessionstart && value ? value >= sessionstart : true;
      }
    ),
  sessionspot: yup.string().required("집결지를 작성해주세요."),
  sessionpaceminutes: yup.number().required("시간을 설정해주세요."),
  sessionpaceseconds: yup.number().required("시간을 설정해주세요."),
  sessioninfo: yup.string().max(1000).required("상세내용을 작성해주세요."),
});

type FormValues = {
  sessiontype: string;
  sessiontitle: string;
  sessionmembers: number;
  sessionposter?: FileList;
  sessionspot: string;
  sessionstart?: Date;
  sessionend: Date;
  sessionpaceminutes: number;
  sessionpaceseconds: number;
  sessioninfo: string;
};

const SessionCreateOrganism: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMinutes, setSelectedMinutes] = useState<number>();
  const [userRole, setUserRole] = useState<string>("");
  const [hasCrew, setHasCrew] = useState<boolean>(false);
  const [crewId, setCrewId] = useState<number | undefined>(undefined);
  const [mapId, setMapId] = useState<number>(0);
  const [FilteredCrews, setFilteredCrews] = useState<CrewDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      sessiontype: "번개런",
      sessionstart: new Date(),
      sessionend: new Date(),
    },
  });

  const { data: crewData, isLoading: crewLoading } = useQuery(
    "myCrews",
    getMyCrews
  );
  const { data: mapData, isLoading: mapLoading } = useQuery(
    "myMaps",
    getMapList
  );

  const closeModal = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!crewLoading && !mapLoading) {
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + 30);
      setValue("sessionstart", currentDate);

      if (mapData && mapData.length === 0) {
        setErrorMessage("지도를 한 개 이상 생성해주세요.");
        setTimeout(() => {
          navigate("/profile", { replace: true });
        }, 2000);
        return;
      }

      if (crewData && crewData.crews.length > 0) {
        setHasCrew(true);
        setUserRole("CAPTAIN");
        const filteredCrews = crewData.crews.filter(
          (crew) => crew.position === "PACER" || crew.position === "CAPTAIN"
        );
        setFilteredCrews(filteredCrews);
      }
    }
  }, [crewData, mapData, crewLoading, mapLoading, setValue, navigate]);

  const checkUndefined = async (files: FileList) => {
    if (files) {
      const reversedFiles = Array.from(files).reverse();
      const uploadPromises = reversedFiles.map(
        async (file) => await uploadImage(file)
      );
      return Promise.all(uploadPromises);
    } else {
      return [];
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    const urls = await checkUndefined(data.sessionposter!);
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    };
    const formType = (type: string) => {
      if (type === "번개런") return "THUNDER";
      else if (type === "정규런") return "STANDARD";
      else if (type === "오픈런") return "OPEN";
    };

    const submitData: SessionCreateDto = {
      crewId: crewId,
      courseId: mapId,
      sessionType: formType(data.sessiontype)!,
      name: data.sessiontitle,
      images: urls!,
      pace: data.sessionpaceminutes * 60 + data.sessionpaceseconds,
      spot: data.sessionspot,
      startAt: formatDate(data.sessionstart!),
      endAt: formatDate(data.sessionend!),
      content: data.sessioninfo,
      maxPeople: data.sessionmembers,
    };

    return postCreateSession(submitData)
      .then(() => {
        navigate(`/session?status=active`);
      })
      .catch((error) => {
        setErrorMessage("모든 항목을 확인해주세요.");
        setIsSubmitting(false);
        console.error(error);
      });
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const minutes = Number(event.target.value);
    setSelectedMinutes(minutes);
    setValue("sessionpaceminutes", minutes);
    setValue("sessionpaceseconds", 0);
  };

  const watchedMinutes = watch("sessionpaceminutes", selectedMinutes);
  const watchedSessionStart = watch("sessionstart");
  const watchedSessionEnd = watch("sessionend");
  const watchedSessionType = watch("sessiontype");

  useEffect(() => {
    if (watchedSessionType === "번개런") {
      setCrewId(undefined);
    }
  }, [watchedSessionType]);

  useEffect(() => {
    if (watchedSessionStart) {
      setValue("sessionend", watchedSessionStart);
    }
  }, [watchedSessionStart, setValue]);

  const renderSessionTypeOptions = () => {
    if (FilteredCrews.length === 0 || !hasCrew) {
      return ["번개런"];
    }

    if (userRole === "CAPTAIN" || userRole === "PACER") {
      return ["번개런", "정규런", "오픈런"];
    }

    return ["번개런"];
  };

  return (
    <>
      {errorMessage && (
        <Modal title="알림" onClose={closeModal}>
          <p>{errorMessage}</p>
        </Modal>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap w-full">
          <div className="w-full">
            <Controller
              name="sessiontype"
              control={control}
              render={({ field }) => (
                <InputRadioTypeMolecule
                  id="sessiontype"
                  title="세션 종류"
                  default="번개런"
                  {...field}
                  value={renderSessionTypeOptions()}
                  error={errors.sessiontype?.message}
                  hasError={!!errors.sessiontype}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              )}
            />
          </div>
          {watchedSessionType !== "번개런" && (
            <div className="w-2/5 me-auto">
              <InputDropdonwTypeMolecule
                id="crewId"
                title="크루 선택"
                text=""
                options={FilteredCrews.filter(
                  (crew) => crew.crewName && crew.crewId
                ).map((crew) => ({
                  label: crew.crewName,
                  value: crew.crewId,
                }))}
                value={crewId}
                onChange={(e) => {
                  setCrewId(Number(e.target.value));
                }}
                hasError={false}
              />
            </div>
          )}
          {mapData && (
            <div className="w-2/5">
              <InputDropdonwTypeMolecule
                id="mapId"
                title="지도 선택"
                text=""
                options={mapData
                  .filter((map) => map.name && map.id)
                  .map((map) => ({
                    label: map.name,
                    value: map.id,
                  }))}
                value={mapId}
                onChange={(e) => {
                  setMapId(Number(e.target.value));
                }}
                hasError={false}
              />
            </div>
          )}
          <div className="w-full">
            <Controller
              name="sessiontitle"
              control={control}
              render={({ field }) => (
                <InputTextTypeMolecule
                  id="sessiontitle"
                  title="세션명"
                  placeholder="세션명"
                  {...field}
                  error={errors.sessiontitle?.message}
                  hasError={!!errors.sessiontitle}
                />
              )}
            />
          </div>
          <div className="w-1/4 me-4">
            <Controller
              name="sessionpaceminutes"
              control={control}
              render={({ field }) => (
                <InputDropdonwTypeMolecule
                  id="sessionpaceminutes"
                  title="평균 페이스"
                  text="분"
                  options={pace.map((time) => ({
                    label: String(time.minutes),
                    value: time.minutes,
                  }))}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleMinutesChange(e);
                  }}
                  error={errors.sessionpaceminutes?.message}
                  hasError={!!errors.sessionpaceminutes}
                />
              )}
            />
          </div>
          <div className="w-1/4 me-4">
            <Controller
              name="sessionpaceseconds"
              control={control}
              render={({ field }) => (
                <InputDropdonwTypeMolecule
                  id="sessionpaceseconds"
                  title=""
                  text="초"
                  options={
                    pace
                      .find((time) => time.minutes === watchedMinutes)
                      ?.seconds.map((seconds) => ({
                        label: String(seconds),
                        value: seconds,
                      })) || []
                  }
                  {...field}
                  hasError={!!errors.sessionpaceseconds}
                  disabled={!watchedMinutes}
                />
              )}
            />
          </div>
          <div className="w-1/4">
            <Controller
              name="sessionmembers"
              control={control}
              render={({ field }) => (
                <InputNumberTypeMolecule
                  id="sessionmembers"
                  title="참가 인원"
                  placeholder="인원 수"
                  {...field}
                  error={errors.sessionmembers?.message}
                  hasError={!!errors.sessionmembers}
                />
              )}
            />
          </div>
          <Controller
            name="sessionposter"
            control={control}
            render={({ field }) => (
              <ImageMultiTypeMolecule
                id="sessionposter"
                title="포스터"
                text="처음에 선택한 사진이 메인에 노출됩니다."
                placeholder=""
                {...field}
                onChange={(e) => {
                  setValue("sessionposter", e.target.files!);
                }}
              />
            )}
          />
          <Controller
            name="sessionspot"
            control={control}
            render={({ field }) => (
              <InputTextTypeMolecule
                id="sessionspot"
                title="집결지"
                placeholder="ex) 여의도 한강공원"
                {...field}
                error={errors.sessionspot?.message}
                hasError={!!errors.sessionspot}
              />
            )}
          />
          <Controller
            name="sessioninfo"
            control={control}
            render={({ field }) => (
              <InputTextAreaNoLimitTypeMolecule
                id="sessioninfo"
                title="상세내용"
                placeholder="상세내용을 입력해 주세요."
                {...field}
                error={errors.sessioninfo?.message}
                hasError={!!errors.sessioninfo}
              />
            )}
          />
          <div className="w-5/12 me-auto">
            <Controller
              name="sessionstart"
              control={control}
              render={({ field }) => (
                <InputDateStartTypeMolecule
                  id="sessionstart"
                  title="세션 시작"
                  selected={field.value ?? new Date()}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="w-5/12">
            <Controller
              name="sessionend"
              control={control}
              render={({ field }) => (
                <InputDateEndTypeMolecule
                  id="sessionend"
                  title="세션 종료"
                  selected={field.value ?? new Date()}
                  onChange={field.onChange}
                  minDate={watchedSessionStart}
                />
              )}
            />
          </div>
          {errors.sessionend &&
          watchedSessionStart &&
          watchedSessionEnd &&
          watchedSessionEnd < watchedSessionStart ? (
            <p className="ps-4 mb-3 text-sm font-light text-red-500">
              종료시간은 시작시간보다 늦어야 합니다.
            </p>
          ) : (
            <div className="ps-4 mb-3"></div>
          )}
        </div>
        <div>
          {isValid ? (
            <LargeAbleButton text="생성" isLoading={isSubmitting} />
          ) : (
            <LargeDisableButton text="생성" />
          )}
        </div>
      </form>
    </>
  );
};

export default SessionCreateOrganism;
