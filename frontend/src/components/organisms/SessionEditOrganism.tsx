import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import InputNumberTypeMolecule from "../molecules/Input/InputNumberTypeMolecule";
import ImageMultiTypeMolecule from "../molecules/Input/InputImageMultiTypeMolecule";
import InputDropdonwTypeMolecule from "../molecules/Input/InputDropdonwTypeMolecule";
import InputTextAreaNoLimitTypeMolecule from "../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputDateStartTypeMolecule from "../molecules/Input/InputDateStartTypeMolecule";
import InputDateEndTypeMolecule from "../molecules/Input/InputDateEndTypeMolecule";
import { pace } from "../../pace";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import {
  editSession,
  getSessionDetail,
  EditSessionRequestDto,
  SessionDetailDto,
} from "../../apis/api/sessiondetail";
import { uploadImage } from "../../apis/api/presigned";
import { getMapList } from "../../apis/api/mycourse";
import Modal from "../molecules/ModalMolecules";

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
  sessioncourse: yup.string().nullable(),
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

const SessionEditOrganism: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: mapData } = useQuery("myMaps", getMapList);
  const { data: sessionData } = useQuery<SessionDetailDto, Error>(
    ["getSessionDetail", sessionId],
    () => getSessionDetail({ sessionId: Number(sessionId) })
  );
  const navigate = useNavigate();

  const [selectedMinutes, setSelectedMinutes] = useState<number>();
  const [mapId, setMapId] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 오류 메시지 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: sessionData
      ? {
          sessiontype: sessionData.sessionType,
          sessiontitle: sessionData.sessionName,
          sessionmembers: sessionData.maxPeople,
          sessionspot: sessionData.spot,
          sessionstart: new Date(sessionData.startAt),
          sessionend: new Date(sessionData.endAt),
          sessionpaceminutes: Math.floor(sessionData.pace / 60),
          sessionpaceseconds: sessionData.pace % 60,
          sessioninfo: sessionData.content,
        }
      : undefined,
  });

  const [isFilesChanged, setIsFilesChanged] = useState(false);

  useEffect(() => {
    if (sessionData) {
      setValue("sessiontype", sessionData.sessionType);
      setValue("sessiontitle", sessionData.sessionName);
      setValue("sessionmembers", sessionData.maxPeople);
      setValue("sessionspot", sessionData.spot);
      setValue("sessionstart", new Date(sessionData.startAt));
      setValue("sessionend", new Date(sessionData.endAt));
      setValue("sessionpaceminutes", Math.floor(sessionData.pace / 60));
      setValue("sessionpaceseconds", sessionData.pace % 60);
      setValue("sessioninfo", sessionData.content);
      setMapId(sessionData.courseId);
      setCurrentImages(sessionData.sessionPosters);
    }
  }, [sessionData, setValue]);

  useEffect(() => {
    if (mapData && mapData.length === 0) {
      setErrorMessage("지도를 생성해주세요");
      return;
    }
  }, [mapData]);

  const watchedPoster = useWatch({ control, name: "sessionposter" });

  useEffect(() => {
    if (watchedPoster) {
      setIsFilesChanged(true);
    }
  }, [watchedPoster]);

  const checkUndefined = async (files: FileList) => {
    if (files) {
      const uploadPromises = Array.from(files)
        .reverse()
        .map(async (file) => {
          const result = await uploadImage(file);
          return result;
        });
      return Promise.all(uploadPromises);
    } else {
      return [];
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    if (isValid === false && isDirty === false) {
      return;
    }
    try {
      const uploadedUrls = await checkUndefined(data.sessionposter!);
      const images = uploadedUrls.length > 0 ? uploadedUrls : currentImages;
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const submitData: EditSessionRequestDto = {
        sessionId: Number(sessionId),
        courseId: mapId,
        sessionType: data.sessiontype,
        name: data.sessiontitle,
        images: images!,
        pace: data.sessionpaceminutes * 60 + data.sessionpaceseconds,
        spot: data.sessionspot,
        startAt: formatDate(data.sessionstart!),
        endAt: formatDate(data.sessionend!),
        content: data.sessioninfo,
        maxPeople: data.sessionmembers,
      };
      await editSession(submitData);
      navigate(`/session/${sessionId}`);
    } catch (error) {
      setErrorMessage("세션 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    }
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

  useEffect(() => {
    if (watchedSessionStart) {
      setValue("sessionend", watchedSessionStart);
    }
  }, [watchedSessionStart, setValue]);

  const closeModal = () => {
    setErrorMessage(null); // 모달 닫기
  };

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {errorMessage && (
        <Modal title="오류" onClose={closeModal}>
          <p>{errorMessage}</p>
        </Modal>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap w-full">
          {mapData && (
            <div className="w-2/5">
              <InputDropdonwTypeMolecule
                id="mapId"
                title="지도 선택"
                text=""
                options={mapData.map((map) => ({
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
                  placeholder={String(sessionData.maxPeople)}
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
                text="포스터 다시 선택하기"
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
          {(isValid && isDirty) || isFilesChanged ? (
            <LargeAbleButton
              text="수정 완료"
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            />
          ) : (
            <LargeDisableButton text="수정 완료" />
          )}
        </div>
      </form>
    </>
  );
};

export default SessionEditOrganism;
