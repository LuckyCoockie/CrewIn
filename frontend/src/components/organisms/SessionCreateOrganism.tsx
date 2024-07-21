import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputTextTypeMolecule from "../molecules/InputTextTypeMolecule";
import InputNumberTypeMolecule from "../molecules/InputNumberTypeMolecule";
import ImageMultiTypeMolecule from "../molecules/ImageMultiTypeMolecule";
import InputDropdonwTypeMolecule from "../molecules/InputDropdonwTypeMolecule";
import InputTextAreaNoLimitTypeMolecule from "../molecules/InputTextAreaNoLimitTypeMolecule";
import InputDateStartTypeMolecule from "../molecules/InputDateStartTypeMolecule";
import InputDateEndTypeMolecule from "../molecules/InputDateEndTypeMolecule";
import { pace } from "../../pace";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import InputRadioTypeMolecule from "../molecules/InputRadioTypeMolecule";

// 유효성 검사 스키마 정의
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
  const [selectedMinutes, setSelectedMinutes] = useState<number>();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    // 유효성 검사 mode
    mode: "onChange",
    defaultValues: {
      sessionstart: new Date(),
      sessionend: new Date(),
    },
  });

  console.log(errors);
  console.log(isValid);
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    console.log(errors);
    console.log(isValid);
  };

  // 분 선택 이후 초 함수
  const handleMinutesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const minutes = Number(event.target.value);
    setSelectedMinutes(minutes);
    setValue("sessionpaceminutes", minutes);
    setValue("sessionpaceseconds", 0); //
  };

  // watch 함수를 사용하여 실시간으로 minutes 필드 값 모니터링
  const watchedMinutes = watch("sessionpaceminutes", selectedMinutes);

  const watchedSessionStart = watch("sessionstart");
  const watchedSessionEnd = watch("sessionend");

  useEffect(() => {
    if (watchedSessionStart) {
      setValue("sessionend", watchedSessionStart); // 시작시간 변경 시 종료시간 최소값 설정
    }
  }, [watchedSessionStart, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap w-full">
          <Controller
            name="sessiontype"
            control={control}
            render={({ field }) => (
              <InputRadioTypeMolecule
                id="sessiontype"
                title="세션 종류"
                {...field}
                value={["번개런", "정규런", "오픈런"]}
                error={errors.sessiontype?.message}
                hasError={!!errors.sessiontype}
              />
            )}
          />
          {/* 세션명 */}
          <div className="w-7/12">
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
          {/* 인원수 */}
          <div className="ms-auto w-3/12 me-auto">
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
          {/* 페이스(분) */}
          <div className="w-1/3 me-4">
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
          {/* 페이스(초) */}
          <div className="w-1/3">
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
          {/* 포스터 */}
          <Controller
            name="sessionposter"
            control={control}
            render={({ field }) => (
              <ImageMultiTypeMolecule
                id="sessionposter"
                title="포스터"
                placeholder=""
                {...field}
              />
            )}
          />
          {/* 집결지 */}
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
          {/* 상세내용 */}
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
          {/* 시작시간 */}
          <div className="w-5/12">
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
          {/* 종료시간 */}
          <div className="ms-auto me-auto w-5/12">
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
          {/* 시작시간 종료시간 error 출력 */}
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
          {/* 유효성 검사 통과 여부에 따라 버튼 교체 */}
          {isValid ? (
            <LargeAbleButton text="생성" />
          ) : (
            <LargeDisableButton text="생성" />
          )}
        </div>
      </form>
    </>
  );
};

export default SessionCreateOrganism;
