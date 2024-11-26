import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../../atoms/Button/LargeDisableButton";
import ModalMolecules from "../../molecules/ModalMolecules";
import InputTextTypeMolecule from "../../molecules/Input/InputTextTypeMolecule";
import { getNicknameDuplicationCheck } from "../../../apis/api/signup";
import ModalConfirm from "../../molecules/ModalConfirmMolecules";

type FormValues = {
  nickname: string;
};

type OwnProps = {
  init?: FormValues;
  onClose: () => void;
  onEdit: (data: FormValues) => Promise<void>;
};

const nameRules = /^([가-힣]{2,}|[A-Za-z\s]{2,})$/;

const schema = yup.object({
  nickname: yup
    .string()
    .min(2, "최소 2자 입니다.")
    .max(10, "최대 10자 입니다.")
    .matches(
      nameRules,
      "특수 문자는 사용할 수 없습니다."
    )
    .required("닉네임을 입력해주세요."),
});

export const EditNicknameOrganism = ({ init, onClose, onEdit }: OwnProps) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      try {
        if (isSubmit) return;
        setIsSubmit(true);
        onEdit(data).then(() => setIsSubmit(false));
      } catch (error) {
        setModalMessage("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
        setIsModalOpen(true);
      }
    },
    [onEdit]
  );

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: init,
  });

  const handleNicknameBlur = async () => {
    const nickname = getValues("nickname");
    if (nickname) {
      try {
        const { duplicated } = await getNicknameDuplicationCheck({ nickname });
        if (duplicated) {
          setError("nickname", {
            type: "manual",
            message: "사용 중인 닉네임입니다.",
          });
        } else {
          clearErrors("nickname");
        }
      } catch (error) {
        setError("nickname", {
          type: "manual",
          message: "유효하지 않는 닉네임입니다.",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
                  placeholder="ex) 달리는동동"
                  error={errors.nickname?.message}
                  {...field}
                  onBlur={handleNicknameBlur}
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

      {isModalOpen && (
        <ModalConfirm title="오류" onClose={handleModalClose}>
          <p>{modalMessage}</p>
        </ModalConfirm>
      )}
    </>
  );
};
