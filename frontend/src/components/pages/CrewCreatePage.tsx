import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextTypeMolecule from "../molecule/InputTextTypeMolecule";
import ImageTypeMolecule from "../molecule/ImageTypeMolecule";

// 유효성 검사 스키마 정의
const schema = yup.object({
  crewname: yup
    .string()
    .max(20, "20글자 이내로 입력해주세요")
    .required("크루명을 입력해주세요."),
  crewslogan: yup
    .string()
    .max(50, "50글자 이내로 입력해주세요.")
    .required("슬로건을 입력해주세요."),
  crewmainlogo: yup.mixed(),
});
type FormValues = {
  crewname: string;
  crewslogan: string;
  crewmainlogo?: FileList;
};

const CrewCreatePage: React.FC = () => {
  // react-hook-form 훅 사용
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange", // 입력 필드가 변경될 때마다 유효성 검사 수행
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    // 폼 제출 후 폼 초기화
    reset();
  };

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
