import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../../atoms/Button/LargeDisableButton";
import ModalMolecules from "../../molecules/ModalMolecules";
import InputPasswordTypeMolecule from "../../molecules/Input/InputPasswordTypeMolecule";

import { NewPasswordRequestDto } from "../../../apis/api/profile";
import { useState } from "react";

const passwordRules = /^(?=.*[a-zA-Z])(?=.*[0-9]).{0,}$/;

type FormValues = {
  pastPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type OwnProps = {
  init?: FormValues;
  onClose: () => void;
  onEdit: (
    password: NewPasswordRequestDto,
    onClose: () => void
  ) => Promise<void>;
};

const schema = yup.object({
  pastPassword: yup
    .string()
    .required("이전 비밀번호를 입력해주세요.")
    .min(4, "비밀번호는 최소 4자입니다.")
    .max(60, "비밀번호는 최대 60자입니다."),
  newPassword: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .matches(passwordRules, {
      message: "영문과 숫자를 각각 하나 이상 포함해야 합니다.",
    })
    .min(4, "비밀번호는 최소 4자입니다.")
    .max(60, "비밀번호는 최대 60자입니다."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호를 확인해주세요."),
});

export const EditPasswordOrganism = ({ onClose, onEdit }: OwnProps) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const submitData: NewPasswordRequestDto = {
      oldPassword: data.pastPassword,
      newPassword: data.newPassword,
    };
    try {
      if (isSubmit) return;
      setIsSubmit(true);
      onEdit(submitData, onClose).then(() => setIsSubmit(false));
    } catch (error) {
      console.error("수정 실패");
      window.alert("이전 비밀번호를 확인하세요.");
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(onSubmit)();
  };

  return (
    <ModalMolecules title="비밀번호 변경" onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
        <div className="w-full">
          <Controller
            name="pastPassword"
            control={control}
            render={({ field }) => (
              <InputPasswordTypeMolecule
                id="pastPassword"
                title="이전 비밀번호"
                placeholder=""
                error={errors.pastPassword?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <InputPasswordTypeMolecule
                id="newPassword"
                title="새로운 비밀번호"
                placeholder="소문자, 대문자 조합 4~60자"
                error={errors.newPassword?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <InputPasswordTypeMolecule
                id="confirmPassword"
                title="비밀번호 확인"
                placeholder=""
                {...field}
                error={errors.confirmPassword?.message}
                hasError={!!errors.confirmPassword}
              />
            )}
          />
        </div>
        <div>
          {isValid ? (
            <LargeAbleButton text="수정" />
          ) : (
            <LargeDisableButton text="수정" />
          )}
        </div>
      </form>
    </ModalMolecules>
  );
};
