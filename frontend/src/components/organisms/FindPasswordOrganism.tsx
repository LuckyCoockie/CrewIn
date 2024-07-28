import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import Modal from "../molecules/ModalMolecules";

const schema = yup.object({
  email: yup
    .string()
    .email("이메일 형식으로 입력해주세요")
    .required("이메일을 입력해주세요."),
  name: yup
    .string()
    .max(30, "이름은 최대 30자입니다.")
    .required("이름을 입력해주세요."),
});

type FormValues = {
  email: string;
  name: string;
};

const FindPasswordOrganism: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap w-full">
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
          <div className="w-full">
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
          {/* 버튼 영역 */}
          {isValid ? (
            <LargeAbleButton text="비밀번호 찾기" />
          ) : (
            <LargeDisableButton text="비밀번호 찾기" />
          )}
        </div>
      </form>

      {/* 모달 */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">비밀번호 찾기</h2>
          <p>이메일로 비밀번호 재설정 링크가 전송되었습니다.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={closeModal}
          >
            닫기
          </button>
        </Modal>
      )}
    </>
  );
};

export default FindPasswordOrganism;
