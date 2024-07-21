import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputTextTypeMolecule from "../molecules/InputTextTypeMolecule";
import InputPasswordTypeMolecule from "../molecules/InputPasswordTypeMolecule";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{0,}$/;

// 유효성 검사 스키마 정의
const schema = yup.object({
  email: yup
    .string()
    .email("이메일 형식으로 입력해주세요")
    .required("이메일을 입력해주세요."),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .matches(passwordRules, {
      message: "소문자와 대문자를 각각 하나 이상 포함해야 합니다.",
    })
    .min(4, "비밀번호는 최소 4자입니다.")
    .max(60, "비밀번호는 최대 60자입니다."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호를 확인해주세요."),
  nickname: yup
    .string()
    .max(10, "최대 10자 입니다.")
    .required("닉네임을 입력해주세요."),
  name: yup
    .string()
    .max(10, "이름은 최대 10자입니다.")
    .required("이름을 입력해주세요."),
});

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  name: string;
};

const LoginOrganism: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 이메일 */}
      <div className="flex flex-wrap w-full">
        <div className="w-5/12">
          {/* 이름 */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputTextTypeMolecule
                id="name"
                title="이름"
                placeholder="홍길동"
                {...field}
                error={errors.name?.message}
                hasError={!!errors.name}
              />
            )}
          />
        </div>
        {/* 닉네임 */}
        <div className="w-5/12 ms-auto me-auto">
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => (
              <InputTextTypeMolecule
                id="nickname"
                title="닉네임"
                placeholder="ex) 달리는 동동"
                {...field}
                error={errors.nickname?.message}
                hasError={!!errors.nickname}
              />
            )}
          />
        </div>
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
        {/* 비밀번호 */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <InputPasswordTypeMolecule
              id="password"
              title="비밀번호"
              placeholder="소문자, 대문자 조합 4~60자"
              {...field}
              error={errors.password?.message}
              hasError={!!errors.password}
            />
          )}
        />
        {/* 비밀번호 확인 */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <InputPasswordTypeMolecule
              id="confirmPassword"
              title="비밀번호 확인"
              placeholder="⦁⦁⦁⦁⦁⦁"
              {...field}
              error={errors.confirmPassword?.message}
              hasError={!!errors.confirmPassword}
            />
          )}
        />
      </div>
      {/* 버튼 영역 */}
      <div>
        {/* 유효성 검사 통과 여부에 따라 버튼 교체 */}
        {isValid ? (
          <LargeAbleButton text="생성" />
        ) : (
          <LargeDisableButton text="생성" />
        )}
      </div>
    </form>
  );
};

export default LoginOrganism;
