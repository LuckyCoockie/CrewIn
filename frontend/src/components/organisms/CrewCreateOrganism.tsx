import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import InputImageTypeMolecule from "../molecules/Input/InputImageTypeMolecule";
import InputDateTypeMolecule from "../molecules/Input/InputDateTypeMolecule";
import InputTextAreaTypeMolecule from "../molecules/Input/InputTextAreaTypeMolecule";
import ImageTypeBannerMolecule from "../molecules/Input/InputImageTypeBannerMolecule";
import InputDropdonwTypeMolecule from "../molecules/Input/InputDropdonwTypeMolecule";
import { regions } from "../../regions";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";

import { CrewCreateDto, postCreateCrew } from "../../apis/api/crewcreate";

import { uploadImage } from "../../apis/api/presigned";
import { useNavigate } from "react-router";

// 유효성 검사 스키마 정의
const schema = yup.object({
  crew_name: yup
    .string()
    .max(20, "20글자 이내로 입력해주세요.")
    .required("크루명을 입력해주세요."),
  slogan: yup
    .string()
    .max(50, "50글자 이내로 입력해주세요.")
    .required("슬로건을 입력해주세요."),
  main_logo: yup.mixed(),
  sub_logo: yup.mixed(),
  banner: yup.mixed(),
  crewcreatedat: yup.date().nullable(),
  introduction: yup
    .string()
    .max(255, "255글자를 초과할 수 없습니다.")
    .required("크루 소개를 입력해주세요."),
  city: yup.string().required("도시를 선택해주세요."),
  district: yup.string().required("시/군/구를 선택해주세요."),
});
type FormValues = {
  crew_name: string;
  slogan: string;
  main_logo?: File;
  sub_logo?: File;
  banner?: File;
  crewcreatedat?: Date | null;
  introduction: string;
  city: string;
  district: string;
};

const CrewCreateOrganism: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("");

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
      crewcreatedat: new Date(),
    },
  });

  const checkUndefined = async (file?: File) => {
    if (file) {
      return uploadImage(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    Promise.all([
      checkUndefined(data.main_logo),
      checkUndefined(data.sub_logo),
      checkUndefined(data.banner),
    ])
      .then(([mainLogoImageUrl, subLogoImageUrl, bannerImageUrl]) => {
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        const submitData: CrewCreateDto = {
          name: data.crew_name,
          slogan: data.slogan,
          area: `${data.city} ${data.district}`,
          introduction: data.introduction,
          crewBirth: formatDate(data.crewcreatedat!),
          mainLogo: mainLogoImageUrl!,
          subLogo: subLogoImageUrl!,
          banner: bannerImageUrl!,
        };

        console.log(submitData);
        // 제출 API
        return postCreateCrew(submitData); // 제출 API 호출
      })
      .then((response) => {
        console.log("Crew created successfully");
        console.log(response.crewId);

        // 성공 시 크루 Detail페이지로 이동
        navigate(`/crew/detail/${response.crewId}`);
      })
      .catch((error) => {
        console.error("Crew created fail:", error);
      });
  };

  // 도시 선택 이후 시/군/구 함수
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
      {/* 본문 파트 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap">
          <div className="w-full">
            <Controller
              name="crew_name"
              control={control}
              render={({ field }) => (
                <InputTextTypeMolecule
                  id="crew_name"
                  title="크루명*"
                  placeholder="멋진 크루명을 입력해주세요!"
                  {...field}
                  error={errors.crew_name?.message}
                  hasError={!!errors.crew_name}
                />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="slogan"
              control={control}
              render={({ field }) => (
                <InputTextTypeMolecule
                  id="slogan"
                  title="슬로건*"
                  placeholder="ex) 같이의 가치"
                  {...field}
                  error={errors.slogan?.message}
                  hasError={!!errors.slogan}
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
                  text="---"
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
                  text="---"
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
              name="main_logo"
              control={control}
              render={({ field }) => (
                <InputImageTypeMolecule
                  id="main_logo"
                  title="메인로고"
                  placeholder="1:1 비율이 가장 적합합니다."
                  {...field}
                  onChange={(e) => {
                    setValue("main_logo", e.target.files![0]);
                  }}
                  text="프로필 사진에 노출됩니다."
                />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="sub_logo"
              control={control}
              render={({ field }) => (
                <InputImageTypeMolecule
                  id="sub_logo"
                  title="서브로고"
                  placeholder="1:1 비율이 가장 적합합니다."
                  {...field}
                  onChange={(e) => {
                    setValue("sub_logo", e.target.files![0]);
                  }}
                  text="게시글 생성 시 사용됩니다."
                />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="banner"
              control={control}
              render={({ field }) => (
                <ImageTypeBannerMolecule
                  id="banner"
                  title="배너"
                  placeholder="3:2 비율이 가장 적합합니다."
                  {...field}
                  onChange={(e) => {
                    setValue("banner", e.target.files![0]);
                  }}
                />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="introduction"
              control={control}
              render={({ field }) => (
                <InputTextAreaTypeMolecule
                  id="introduction"
                  title="크루 소개*"
                  placeholder="크루에 대한 설명을 입력해주세요."
                  {...field}
                  error={errors.introduction?.message}
                  hasError={!!errors.introduction}
                />
              )}
            />
          </div>
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

export default CrewCreateOrganism;
