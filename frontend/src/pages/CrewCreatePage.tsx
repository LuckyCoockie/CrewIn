import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextTypeMolecule from "../components/molecules/InputTextTypeMolecule";
import ImageTypeMolecule from "../components/molecules/ImageTypeMolecule";
import InputDateTypeMolecule from "../components/molecules/InputDateTypeMolecule";
import InputTextAreaTypeMolecule from "../components/molecules/InputTextAreaTypeMolecule";
import ImageTypeBannerMolecule from "../components/molecules/ImageTypeBannerMolecule";
import InputDropdonwTypeMolecule from "../components/molecules/InputDropdonwTypeMolecule";
import { regions } from "../regions";
import LargeDisableButton from "../components/atoms/Button/LargeDisableButton";

// 유효성 검사 스키마 정의
const schema = yup.object({
  crewname: yup
    .string()
    .max(20, "20글자 이내로 입력해주세요.")
    .required("크루명을 입력해주세요."),
  crewslogan: yup
    .string()
    .max(50, "50글자 이내로 입력해주세요.")
    .required("슬로건을 입력해주세요."),
  crewmainlogo: yup.mixed(),
  crewsublogo: yup.mixed(),
  crewbanner: yup.mixed(),
  crewcreatedat: yup.date().nullable(),
  crewintroduce: yup
    .string()
    .max(255, "255글자를 초과할 수 없습니다.")
    .required("크루 소개를 입력해주세요."),
  city: yup.string().required("도시를 선택해주세요."),
  district: yup.string().required("시/군/구를 선택해주세요."),
});
type FormValues = {
  crewname: string;
  crewslogan: string;
  crewmainlogo?: FileList;
  crewsublogo?: FileList;
  crewbanner?: FileList;
  crewcreatedat?: Date | null;
  crewintroduce: string;
  city: string;
  district: string;
};

const CrewCreatePage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");

  // react-hook-form 훅 사용
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    // 유효성 검사 mode
    mode: "onChange",
    defaultValues: {
      crewcreatedat: new Date(),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  // 도시 선택 시 호출되는 함수
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    setValue("city", city);
    setValue("district", ""); // 도시가 변경되면 구/군/구 필드를 초기화
  };

  // watch 함수를 사용하여 실시간으로 city 필드 값 모니터링
  const watchedCity = watch("city", selectedCity);

  return (
    <>
      {/* 헤더 파트 */}

      {/* 본문 파트 */}
      <main className="flex items-center justify-center">
        <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 이하 크루 생성 컴포넌트 */}
            <div className="flex flex-wrap">
              <div className="w-full">
                <Controller
                  name="crewname"
                  control={control}
                  render={({ field }) => (
                    <InputTextTypeMolecule
                      id="crewname"
                      title="크루명*"
                      placeholder="멋진 크루명을 입력해주세요!"
                      {...field}
                      error={errors.crewname?.message}
                      hasError={!!errors.crewname}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="crewslogan"
                  control={control}
                  render={({ field }) => (
                    <InputTextTypeMolecule
                      id="crewslogan"
                      title="슬로건*"
                      placeholder="ex) 같이의 가치"
                      {...field}
                      error={errors.crewslogan?.message}
                      hasError={!!errors.crewslogan}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="crewmainlogo"
                  control={control}
                  render={({ field }) => (
                    <ImageTypeMolecule
                      id="crewmainlogo"
                      title="메인로고"
                      placeholder="1:1 비율이 가장 적합합니다."
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="crewsublogo"
                  control={control}
                  render={({ field }) => (
                    <ImageTypeMolecule
                      id="crewsublogo"
                      title="서브로고"
                      placeholder="1:1 비율이 가장 적합합니다."
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="crewbanner"
                  control={control}
                  render={({ field }) => (
                    <ImageTypeBannerMolecule
                      id="crewbanner"
                      title="배너"
                      placeholder="3:2 비율이 가장 적합합니다."
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="crewcreatedat"
                  control={control}
                  render={({ field }) => (
                    <InputDateTypeMolecule
                      id="crewcreatedat"
                      title="크루 창립일"
                      selected={field.value ?? new Date()}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="crewintroduce"
                  control={control}
                  render={({ field }) => (
                    <InputTextAreaTypeMolecule
                      id="crewintroduce"
                      title="크루 소개*"
                      placeholder="크루에 대한 설명을 입력해주세요."
                      {...field}
                      error={errors.crewintroduce?.message}
                      hasError={!!errors.crewintroduce}
                    />
                  )}
                />
              </div>
              {/* 도시 */}
              <div className="w-2/5 me-auto">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <InputDropdonwTypeMolecule
                      id="city"
                      title="도시*"
                      options={regions.map((region) => ({
                        label: region.city,
                        value: region.city,
                      }))}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        handleCityChange(e);
                      }}
                      error={errors.city?.message}
                      hasError={!!errors.city}
                    />
                  )}
                />
              </div>
              {/* 시/군/구 */}
              <div className="w-2/5">
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <InputDropdonwTypeMolecule
                      id="district"
                      title="시/군/구*"
                      options={
                        regions
                          .find((region) => region.city === watchedCity)
                          ?.districts.map((district) => ({
                            label: district,
                            value: district,
                          })) || []
                      }
                      {...field}
                      error={errors.district?.message}
                      hasError={!!errors.district}
                      disabled={!watchedCity}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <LargeDisableButton text="제출하기" />
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CrewCreatePage;
