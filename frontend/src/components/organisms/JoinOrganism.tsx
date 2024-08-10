import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import InputEmailTypeMolecule from "../molecules/Input/InputEmailTypeMolecule";
import InputPasswordTypeMolecule from "../molecules/Input/InputPasswordTypeMolecule";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import Timer from "../atoms/Timer";

import {
  getEmailDuplicationCheck,
  getNicknameDuplicationCheck,
  postMemberCheck,
  getCodeCheck,
  joinMember,
  JoinMemberInfoDto,
} from "../../apis/api/signup";
import { useNavigate } from "react-router";

// 비밀번호 규칙 설정
const passwordRules = /^(?=.*[a-zA-Z])(?=.*[0-9]).{0,}$/;

// yup 스키마 정의
const schema = yup.object({
  email: yup
    .string()
    .email("이메일 형식으로 입력해주세요")
    .max(50, "이메일은 최대 50자입니다.")
    .required("이메일을 입력해주세요.")
    .test(
      "emailDuplicationCheck",
      "이미 사용 중인 이메일입니다.",
      async (value) => {
        if (!value) return true;
        try {
          const { duplicated } = await getEmailDuplicationCheck({
            email: value,
          });
          return !duplicated;
        } catch (error) {
          return false;
        }
      }
    ),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .matches(passwordRules, {
      message: "영문과 숫자를 각각 하나 이상 포함해야 합니다.",
    })
    .min(4, "비밀번호는 최소 4자입니다.")
    .max(60, "비밀번호는 최대 60자입니다."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호를 확인해주세요."),
  nickname: yup
    .string()
    .min(2, "최소 2자 입니다.")
    .max(10, "최대 10자 입니다.")
    .required("닉네임을 입력해주세요.")
    .test(
      "nicknameDuplicationCheck",
      "이미 사용 중인 닉네임입니다.",
      async (value) => {
        if (!value) return true;
        try {
          const { duplicated } = await getNicknameDuplicationCheck({
            nickname: value,
          });
          return !duplicated;
        } catch (error) {
          return false;
        }
      }
    ),
  name: yup
    .string()
    .min(2, "이름은 최소 2자입니다.")
    .max(30, "이름은 최대 30자입니다.")
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
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCodeInput, setIsCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const submitData: JoinMemberInfoDto = {
      ...data,
    };
    try {
      // 회원가입 API 호출
      await joinMember(submitData);
      console.log("회원가입 성공");
      navigate(`/login`);
    } catch (error) {
      console.error("회원가입 실패:", error);
      window.alert("회원가입에 실패했습니다.");
    }
  };
  const [timer, setTimer] = useState(false);

  const handleEmailVerification = async () => {
    const email = getValues("email");
    try {
      if (email) {
        await postMemberCheck({ email });
        setTimer(true);
        setIsCodeInput(true);
        setIsEmailValid(true);
      } else return;
    } catch (error) {
      console.error("이메일 인증 실패:", error);
    }
  };

  const handleCodeVerification = async () => {
    const email = getValues("email"); // 이메일 값 가져오기
    if (!email) {
      console.error("이메일이 유효하지 않습니다.");
      return;
    }
    try {
      const response = await getCodeCheck({ email, code: verificationCode }); // getCodeCheck 함수 호출
      if (response.verified) {
        console.log("인증번호 일치");
        setIsCodeVerified(true);
      } else {
        console.log("인증번호 미일치");
        setIsCodeVerified(false);
      }
    } catch (error) {
      console.log("인증번호 검증 중 오류 발생:", error);
      setIsCodeVerified(false);
    }
  };

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
                disabled={isCodeInput}
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
                disabled={isCodeInput}
              />
            )}
          />
        </div>
        {/* 이메일 */}
        <div className="w-full">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputEmailTypeMolecule
                id="email"
                title="이메일"
                placeholder="ex) mycrew@crew.co.kr"
                {...field}
                error={errors.email?.message}
                hasError={!!errors.email}
                disabled={isCodeInput}
              />
            )}
          />
        </div>
        {/* 비밀번호 */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <InputPasswordTypeMolecule
              id="password"
              title="비밀번호"
              placeholder="영문, 숫자 조합 4~60자"
              {...field}
              error={errors.password?.message}
              hasError={!!errors.password}
              disabled={isCodeInput}
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
              disabled={isCodeInput}
            />
          )}
        />
      </div>
      {/* 버튼 영역 */}
      {isValid && !isCodeInput ? (
        <button
          type="button"
          className="button-color w-full mb-4"
          onClick={handleEmailVerification}
          disabled={!isValid}
        >
          이메일 인증
        </button>
      ) : !isCodeInput ? (
        <button
          className="w-full bg-[#2b2f401a] py-2 text-center rounded-lg text-white font-bold"
          disabled
        >
          이메일 인증
        </button>
      ) : null}

      {isEmailValid && (
        <>
          <div className="flex">
            <div className="w-9/12 mb-4 relative">
              <input
                type="number"
                className="data-input focus:ring-0"
                placeholder="인증번호"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {timer && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Timer />
                </div>
              )}
            </div>
            <div className="w-3/12 ms-2 text-center">
              <button
                type="button"
                className="button-color w-full border-transparent"
                onClick={handleCodeVerification}
              >
                확인
              </button>
            </div>
          </div>
          {isValid && isCodeVerified && isEmailValid ? (
            <LargeAbleButton text="회원가입" />
          ) : (
            <LargeDisableButton text="회원가입" />
          )}
        </>
      )}
    </form>
  );
};

export default LoginOrganism;
