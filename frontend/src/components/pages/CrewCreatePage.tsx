import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextTypeMolecule from "../molecule/InputTextTypeMolecule";
import ImageTypeMolecule from "../molecule/ImageTypeMolecule";
import InputDateTypeMolecule from "../molecule/InputDateTypeMolecule";
import InputTextAreaTypeMolecule from "../molecule/InputTextAreaTypeMolecule";
import { regions } from "../../regions";

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
});
type FormValues = {
  crewname: string;
  crewslogan: string;
  crewmainlogo?: FileList;
  crewsublogo?: FileList;
  crewbanner?: FileList;
  crewcreatedat?: Date | null; // Date 타입이 null을 허용하도록 변경
  crewintroduce: string;
};

const CrewCreatePage: React.FC = () => {
  // react-hook-form 훅 사용
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    // 유효성 검사 mode
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  // 지역
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
    setSelectedDistrict(""); // Reset district when city changes
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDistrict(event.target.value);
  };

  const districts =
    regions.find((region) => region.city === selectedCity)?.districts || [];

  return (
    <>
      {/* 헤더 파트 */}

      {/* 본문 파트 */}
      <main className="flex items-center justify-center">
        <div className="mx-auto w-full max-w-[550px] pt-4">
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
                    <ImageTypeMolecule
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
                      selected={field.value ?? null} // undefined를 null로 변환
                      onChange={field.onChange} // onChange 핸들러 추가
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
              {/* 지역 */}
              <div>
                <div>
                  <label htmlFor="city">도시:</label>
                  <select
                    id="city"
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    <option value="">도시를 선택하세요</option>
                    {regions.map((region) => (
                      <option key={region.city} value={region.city}>
                        {region.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="district">구:</label>
                  <select
                    id="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedCity}
                  >
                    <option value="">구를 선택하세요</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center outline-none">
                제출하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CrewCreatePage;
