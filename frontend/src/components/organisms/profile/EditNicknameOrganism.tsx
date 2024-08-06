import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../../atoms/Button/LargeDisableButton";
import ModalMolecules from "../../molecules/ModalMolecules";
import InputTextTypeMolecule from "../../molecules/Input/InputTextTypeMolecule";
import { getNicknameDuplicationCheck } from "../../../apis/api/signup";

type FormValues = {
  nickname: string;
};

type OwnProps = {
  init?: FormValues;
  onClose: () => void;
  onEdit: (data: FormValues) => Promise<void>;
};

const schema = yup.object({
  nickname: yup
    .string()
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
});

export const EditNicknameOrganism = ({ init, onClose, onEdit }: OwnProps) => {
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
    <ModalMolecules title="닉네임 변경" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => (
              <InputTextTypeMolecule
                id="nickname"
                title="닉네임"
                placeholder="ex) 달리는 동동"
                error={errors.nickname?.message}
                {...field}
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
