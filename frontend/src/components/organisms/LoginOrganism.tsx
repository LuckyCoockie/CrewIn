import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputTextTypeMolecule from "../molecules/InputTextTypeMolecule";
import InputPasswordTypeMolecule from "../molecules/InputPasswordTypeMolecule";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";

type OwnProps = {
  login: (value: FormValues) => Promise<void>;
};

// 유효성 검사 스키마 정의
const schema = yup.object({
  email: yup
    .string()
    .email("이메일 형식으로 입력해주세요")
    .required("이메일을 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
});
type FormValues = {
  email: string;
  password: string;
};

const LoginOrganism: React.FC<OwnProps> = ({ login }: OwnProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    // 유효성 검사 mode
    mode: "onChange",
    defaultValues: {},
  });

  const [isFailed, setIsFailed] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    login(data).catch((error) => {
      console.log(error);
      setIsFailed(true);
    });
  };

  return (
    <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 이메일 */}
        <div className="w-full">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputTextTypeMolecule
                id="email"
                title="이메일"
                placeholder="ex) mycrew@crew.co.kr"
                {...field}
                error={errors.email?.message}
                hasError={!!errors.email}
              />
            )}
          />
        </div>
        {/* 비밀번호 */}
        <div className="w-full">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputPasswordTypeMolecule
                id="password"
                title="비밀번호"
                placeholder="⦁⦁⦁⦁⦁⦁"
                {...field}
                error={errors.password?.message}
                hasError={!!errors.password}
              />
            )}
          />
        </div>
        <div>
          {isFailed ?? (
            <p className="ps-4 pt-1 text-sm font-light text-red-500">
              {"이메일 또는 비밀번호가 잘못되었습니다."}
            </p>
          )}
          <LargeDisableButton text="로그인" />
        </div>
      </form>
    </div>
  );
};

export default LoginOrganism;
