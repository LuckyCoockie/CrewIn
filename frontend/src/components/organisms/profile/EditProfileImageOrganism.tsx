import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import InputImageTypeMolecule from "../../molecules/Input/InputImageTypeMolecule";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../../atoms/Button/LargeDisableButton";
import ModalMolecules from "../../molecules/ModalMolecules";

type FormValues = {
  image?: File;
};

type OwnProps = {
  init?: FormValues;
  onClose: () => void;
  onEdit: (data: FormValues) => Promise<void>;
};

const schema = yup.object({
  image: yup.mixed(),
});

export const EditProfileImageOrganism = ({
  init,
  onClose,
  onEdit,
}: OwnProps) => {
  const onSubmit: SubmitHandler<FormValues> = useCallback(
    (data) => {
      console.log(data.image);
      onEdit(data);
    },
    [onEdit]
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: init,
  });

  return (
    <ModalMolecules title="프로필 사진 변경" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <InputImageTypeMolecule
                text=""
                id="image"
                title="프로필 사진"
                placeholder="1:1 비율이 가장 적합합니다."
                {...field}
                onChange={(e) => {
                  if (!e.target.files || e.target.files.length <= 0) {
                    setValue("image", undefined);
                  } else {
                    setValue("image", e.target.files![0]);
                  }
                }}
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
