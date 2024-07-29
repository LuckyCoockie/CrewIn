import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";

import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import InputPasswordTypeMolecule from "../molecules/Input/InputPasswordTypeMolecule";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

import { getEmailDuplicationCheck } from "../../apis/api/signup";

// 비밀번호 규칙 설정
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{0,}$/;

// FormValues 타입 정의
type FormValues = {
  email?: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  name: string;
};

// yup 스키마에 이메일 중복 확인 메서드 추가
yup.addMethod<yup.StringSchema>(
  yup.string,
  "emailDuplicationCheck",
  function (message) {
    return this.test(
      "emailDuplicationCheck",
      message,
      function (value, context) {
        const { createError } = context;

        // debounce 설정
        const debouncedCheck = _.debounce(async (value: string) => {
          try {
            const { duplicated } = await getEmailDuplicationCheck({
              email: value,
            });
            if (duplicated) {
              createError({ message });
            }
          } catch (error) {
            createError({ message: "이메일 확인 중 오류 발생" });
          }
        }, 500); // 500ms 후에 서버 확인

        // 유효성 검사를 비동기로 처리
        if (value) {
          return new Promise((resolve) => {
            debouncedCheck(value);
            resolve(true);
          });
        }

        return true;
      }
    );
  }
);

// 유효성 검사 스키마 정의
const schema = yup.object({
  email: yup
    .string()
    .email("이메일 형식으로 입력해주세요")
    .required("이메일을 입력해주세요.")
    .emailDuplicationCheck("이미 사용 중인 이메일입니다."),
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
    .max(30, "이름은 최대 30자입니다.")
    .required("이름을 입력해주세요."),
});

const LoginOrganism: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  const handleEmailVerification = () => {
    setIsEmailValid(true);
  };

  const handleCodeVerification = () => {
    if (verificationCode === "123456") {
      console.log("인증번호 일치");
      setIsCodeVerified(true);
    } else {
      console.log("인증번호 미일치");
      setIsCodeVerified(false);
    }
  };
  const isEmailFieldValid = !errors.email; // 이메일 필드의 유효성 확인
  console.log(isEmailFieldValid);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {/* 이메일 */}
        <div className="w-2/3">
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
        <div className="w-1/4 mt-8 mb-4 mx-auto text-center">
          <button
            type="button"
            className={`button-color w-full ${
              !isValid ? "bg-gray-500" : "bg-blue-500"
            }`}
            onClick={handleEmailVerification}
            disabled={!isValid}
          >
            인증
          </button>
        </div>
        {/* 인증번호 확인 */}
        {isEmailValid && (
          <>
            <div className="w-2/3 mb-4">
              <input
                type="text"
                className="data-input border border-gray-300"
                placeholder="인증번호"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <div className="w-1/4 mx-auto text-center">
              <button
                type="button"
                className="button-color w-full border-transparent"
                onClick={handleCodeVerification}
              >
                확인
              </button>
            </div>
          </>
        )}
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
        {isValid && isCodeVerified ? (
          <LargeAbleButton text="생성" />
        ) : (
          <LargeDisableButton text="생성" />
        )}
      </div>
    </form>
  );
};

export default LoginOrganism;
