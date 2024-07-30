import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../../atoms/Button/LargeDisableButton";
import ModalMolecules from "../../molecules/ModalMolecules";
import InputPasswordTypeMolecule from "../../molecules/Input/InputPasswordTypeMolecule";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{0,}$/;

type FormValues = {
  password: string;
  confirmPassword: string;
};

type OwnProps = {
  init?: FormValues;
  onClose: () => void;
  onEdit: (data: FormValues) => Promise<void>;
};

const schema = yup.object({
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
});

export const EditPasswordOrganism = ({ init, onClose, onEdit }: OwnProps) => {
  const onSubmit: SubmitHandler<FormValues> = useCallback(onEdit, [onEdit]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: init,
  });

  return (
    <ModalMolecules onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputPasswordTypeMolecule
                id="password"
                title="비밀번호"
                placeholder="소문자, 대문자 조합 4~60자"
                error={errors.password?.message}
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
                placeholder="⦁⦁⦁⦁⦁⦁"
                {...field}
                error={errors.confirmPassword?.message}
                hasError={!!errors.confirmPassword}
              />
            )}
          />
        </div>
        <div>
          {/* 유효성 검사 통과 여부에 따라 버튼 교체 */}
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
