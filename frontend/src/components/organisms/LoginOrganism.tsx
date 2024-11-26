import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputEmailTypeMolecule from "../molecules/Input/InputEmailTypeMolecule";
import InputPasswordTypeMolecule from "../molecules/Input/InputPasswordTypeMolecule";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import { login } from "../../apis/api/authorization";
import Modal from "../molecules/ModalMolecules";
import { useState } from "react";
import { checkAuth } from "../../util/auth";

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

const LoginOrganism = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });

  const { error } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmit(true);
    try {
      if (checkAuth()) window.location.reload();
      await login(data);
      setIsSubmit(false);
    } catch (err) {
      // 서버 오류 또는 네트워크 오류 등
      setIsSubmit(false);
      setModalTitle("로그인 오류");
      setModalMessage("이메일과 비밀번호를 확인해주세요.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[500px] pt-4 pb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <p className="pb-2 text-sm font-light text-red-500">{error}</p>
          {isValid ? (
            <LargeAbleButton text="로그인" isLoading={isSubmit} />
          ) : (
            <LargeDisableButton text="로그인" />
          )}
        </div>
      </form>

      {/* Modal 컴포넌트 */}
      {isModalOpen && (
        <Modal title={modalTitle} onClose={handleModalClose}>
          <p>{modalMessage}</p>
        </Modal>
      )}
    </div>
  );
};

export default LoginOrganism;
