import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";

import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import InputImageTypeMolecule from "../molecules/Input/InputImageTypeMolecule";
import InputDateTypeMolecule from "../molecules/Input/InputDateTypeMolecule";
import InputTextAreaTypeMolecule from "../molecules/Input/InputTextAreaTypeMolecule";
import ImageTypeBannerMolecule from "../molecules/Input/InputImageTypeBannerMolecule";
import InputDropdonwTypeMolecule from "../molecules/Input/InputDropdonwTypeMolecule";
import { regions } from "../../regions";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import SpinnerComponent from "../atoms/SpinnerComponent";

import {
  getCrewInfo,
  editCrew,
  CrewInfoDto,
  EditCrewRequestDto,
} from "../../apis/api/crewdetail";

import { uploadImage } from "../../apis/api/presigned";

const schema = yup.object({
  crew_name: yup
    .string()
    .max(20, "20글자 이내로 입력해주세요.")
    .required("크루명을 입력해주세요."),
  slogan: yup
    .string()
    .max(50, "50글자 이내로 입력해주세요.")
    .required("슬로건을 입력해주세요."),
  mainLogo: yup.mixed(),
  subLogo: yup.mixed(),
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
  mainLogo?: File;
  subLogo?: File;
  banner?: File;
  crewcreatedat?: Date | null;
  introduction: string;
  city: string;
  district: string;
};

const CrewEditOrganism: React.FC = () => {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: crewData, isLoading } = useQuery<CrewInfoDto, Error>(
    ["getCrewInfo", crewId],
    () => getCrewInfo({ crewId: Number(crewId) })
  );

  const mutation = useMutation(editCrew, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getCrewInfo", crewId]);
      navigate(`/crew/detail/${crewId}`);
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: crewData
      ? {
          crew_name: crewData.crewName,
          slogan: crewData.slogan,
          introduction: crewData.introduction,
          city: crewData.area.split(" ")[0],
          district: crewData.area.split(" ")[1],
          crewcreatedat: new Date(crewData.crewBirth),
        }
      : undefined,
  });

  const [mainLogoPreview, setMainLogoPreview] = useState<string | undefined>(
    undefined
  );
  const [subLogoPreview, setSubLogoPreview] = useState<string | undefined>(
    undefined
  );
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    undefined
  );

  // 추가: 파일이 변경되었는지 감지하는 상태
  const [isFilesChanged, setIsFilesChanged] = useState(false);

  useEffect(() => {
    if (crewData) {
      setValue("crew_name", crewData.crewName);
      setValue("slogan", crewData.slogan);
      setValue("introduction", crewData.introduction);
      const [city, district] = crewData.area.split(" ");
      setValue("city", city);
      setValue("district", district);
      setValue("crewcreatedat", new Date(crewData.crewBirth));

      setMainLogoPreview(crewData.mainLogo);
      setSubLogoPreview(crewData.subLogo);
      setBannerPreview(crewData.banner);
    }
  }, [crewData, setValue]);

  // 파일 변경을 감지하기 위해 watch 사용
  const watchedMainLogo = useWatch({ control, name: "mainLogo" });
  const watchedSubLogo = useWatch({ control, name: "subLogo" });
  const watchedBanner = useWatch({ control, name: "banner" });
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    if (watchedMainLogo || watchedSubLogo || watchedBanner) {
      setIsFilesChanged(true); // 파일이 변경되었음을 표시
    }
  }, [watchedMainLogo, watchedSubLogo, watchedBanner]);

  const checkUndefined = async (file?: File) => {
    if (file) {
      return uploadImage(file);
    }
    return undefined;
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsSubmit(true);
    if (isValid === false) {
      setIsSubmit(false);
      return;
    }
    Promise.all([
      checkUndefined(data.mainLogo),
      checkUndefined(data.subLogo),
      checkUndefined(data.banner),
    ])
      .then(([mainLogoImageUrl, subLogoImageUrl, bannerImageUrl]) => {
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        const submitData: EditCrewRequestDto = {
          crewId: Number(crewId),
          name: data.crew_name,
          slogan: data.slogan,
          area: `${data.city} ${data.district}`,
          introduction: data.introduction,
          crewBirth: formatDate(data.crewcreatedat!),
          mainLogo: mainLogoImageUrl ?? crewData?.mainLogo ?? "",
          subLogo: subLogoImageUrl ?? crewData?.subLogo ?? "",
          banner: bannerImageUrl ?? crewData?.banner ?? "",
        };
        return mutation.mutate(submitData);
      })
      .then(() => {
        setIsSubmit(false);
      })
      .catch((error) => {
        setIsSubmit(false);
        console.error("Crew edited fail:", error);
      });
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setValue("city", city);
    setValue("district", ""); // 도시가 변경되면 구/군/구 필드를 초기화
  };

  const watchedCity = watch("city");

  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <>
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
              name="mainLogo"
              control={control}
              render={({ field }) => (
                <InputImageTypeMolecule
                  id="mainLogo"
                  title="메인로고"
                  placeholder="프로필 사진에 노출됩니다."
                  text="1:1 비율을 권장합니다."
                  previewUrl={mainLogoPreview}
                  {...field}
                  onChange={(e) => {
                    setValue("mainLogo", e.target.files![0]);
                    setMainLogoPreview(URL.createObjectURL(e.target.files![0]));
                  }}
                />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="subLogo"
              control={control}
              render={({ field }) => (
                <InputImageTypeMolecule
                  id="subLogo"
                  title="서브로고"
                  placeholder="게시글 생성 시 사용됩니다."
                  text="1:1 비율을 권장합니다."
                  previewUrl={subLogoPreview}
                  {...field}
                  onChange={(e) => {
                    setValue("subLogo", e.target.files![0]);
                    setSubLogoPreview(URL.createObjectURL(e.target.files![0]));
                  }}
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
                  previewUrl={bannerPreview}
                  {...field}
                  onChange={(e) => {
                    setValue("banner", e.target.files![0]);
                    setBannerPreview(URL.createObjectURL(e.target.files![0]));
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
          {isValid || isFilesChanged ? (
            <LargeAbleButton
              text="수정 완료"
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmit}
            />
          ) : (
            <LargeDisableButton text="수정 완료" />
          )}
        </div>
      </form>
    </>
  );
};

export default CrewEditOrganism;
