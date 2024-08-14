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
import Modal from "../molecules/ModalMolecules";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 오류 메시지 상태 추가
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
      crewcreatedat: new Date(),
    },
  });

  const checkUndefined = async (file?: File) => {
    if (file) {
      return uploadImage(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsSubmitting(true); // 로딩 상태 시작
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
        return postCreateCrew(submitData);
      })
      .then((response) => {
        navigate(`/crew/detail/${response.crewId}`, { replace: true });
      })
      .catch((error) => {
        console.error("Crew created fail:", error);
        setErrorMessage("크루 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        setIsSubmitting(false); // 로딩 상태 종료
      });
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    setValue("city", city);
    setValue("district", "");
  };

  const watchedCity = watch("city", selectedCity);

  const closeModal = () => {
    setErrorMessage(null);
  };

  return (
    <>
      {errorMessage && (
        <Modal title="알림" onClose={closeModal}>
          <p>{errorMessage}</p>
        </Modal>
      )}
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
                  placeholder="프로필 사진에 노출됩니다."
                  {...field}
                  onChange={(e) => {
                    setValue("main_logo", e.target.files![0]);
                  }}
                  text="1:1 비율을 권장합니다."
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
                  placeholder="게시글 생성 시 사용됩니다."
                  {...field}
                  onChange={(e) => {
                    setValue("sub_logo", e.target.files![0]);
                  }}
                  text="1:1 비율을 권장합니다."
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
                  placeholder="크루 상세페이지에 노출됩니다."
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

export default CrewCreateOrganism;
