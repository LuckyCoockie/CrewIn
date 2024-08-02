import React, { useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Carousel } from "react-responsive-carousel";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import cropButton from "../../../assets/images/cropbutton.png";
import checkButton from "../../../assets/images/checkbutton.png";
import InputTextAreaNoLimitTypeMolecule from "../../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputTextTypeMolecule from "../../molecules/Input/InputTextTypeMolecule";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import ImageUploadDropzone from "../../molecules/Input/ImageUploadDropzone";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../../atoms/Button/LargeDisableButton";

import { uploadImage } from "../../../apis/api/presigned";

// 유효성 검사 스키마 정의
const schema = yup.object({
  title: yup.string().required(),
  content: yup.string().required(),
});

type FormValues = {
  title: string;
  content: string;
};

const NoticeCreateTemplate: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });

  const checkUndefined = async (files: File[]) => {
    if (files) {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadImage(file);
        return result;
      });
      return Promise.all(uploadPromises);
    } else {
      return [];
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const urls = await checkUndefined(croppedFiles);

    const submitData = {
      crewId: 1,
      title: data.title,
      content: data.content,
      noticeImages: urls,
    };

    console.log(submitData);
    // 여기에 API 호출 코드를 추가
  };

  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cropAspectRatio] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    const filteredFiles = acceptedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const tempImagePaths: string[] = [];
    const tempCroppedImages: string[] = [];

    filteredFiles.forEach((file) => {
      const tempImagePath = URL.createObjectURL(file);
      tempImagePaths.push(tempImagePath);
      tempCroppedImages.push(tempImagePath);
    });

    setImagePaths(tempImagePaths);
    setCroppedImages(tempCroppedImages);
    setIsCropped(false);
  };

  const handleCrop = (index: number) => {
    const cropperRef = cropperRefs.current[index];
    if (cropperRef && cropperRef.cropper) {
      const cropper = cropperRef.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const croppedImageUrl = URL.createObjectURL(blob);
              const file = new File([blob], `cropped_image_${index}.png`, {
                type: blob.type,
              });

              setCroppedImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = croppedImageUrl;
                return newImages;
              });

              setCroppedFiles((prevFiles) => {
                const newFiles = [...prevFiles];
                newFiles[index] = file;
                return newFiles;
              });
            }
          },
          "image/jpeg",
          1.0
        );
      }
    }
  };

  const handleCropAll = () => {
    if (!isCropped) {
      imagePaths.forEach((_, index) => handleCrop(index));
    }
    setIsCropped(!isCropped);
  };

  return (
    <div className="mx-auto w-full max-w-[550px]">
      <div className="flex flex-col items-center justify-center">
        <header>
          <BackHeaderMediumOrganism text="공지글 작성" />
        </header>
        {imagePaths.length === 0 ? (
          <ImageUploadDropzone onDrop={handleDrop} />
        ) : (
          <>
            <div
              className="relative w-full bg-white rounded-lg"
              style={{ width: 360, height: 360 }}
            >
              <Carousel
                showThumbs={false}
                showIndicators={true}
                showStatus={false}
                infiniteLoop={false}
                swipeable={false}
                className="mb-6"
              >
                {imagePaths.map((imagePath, index) => (
                  <div key={index} className="relative">
                    {!isCropped ? (
                      <Cropper
                        src={imagePath}
                        style={{ height: 360, width: 360 }}
                        aspectRatio={cropAspectRatio}
                        guides={true}
                        ref={(ref: ReactCropperElement | null) => {
                          cropperRefs.current[index] = ref;
                        }}
                        viewMode={1}
                        autoCropArea={1}
                      />
                    ) : (
                      <>
                        <div>
                          <img
                            src={croppedImages[index]}
                            alt={`Cropped ${index}`}
                            style={{ width: 360, height: 360 }}
                          />
                        </div>
                      </>
                    )}
                    <button
                      onClick={handleCropAll}
                      className="absolute bottom-8 right-3 bg-transparent z-1 p-1"
                    >
                      {isCropped ? (
                        <img
                          src={cropButton}
                          alt="crop Button"
                          className="w-10 h-10"
                        />
                      ) : (
                        <img
                          src={checkButton}
                          alt="check Button"
                          className="w-10 h-10"
                        />
                      )}
                    </button>
                  </div>
                ))}
              </Carousel>
            </div>
          </>
        )}

        <main className="w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputTextTypeMolecule
                    id="title"
                    title="제목"
                    placeholder="제목을 입력하세요"
                    {...field}
                    error={errors.title?.message}
                    hasError={!!errors.title}
                  />
                )}
              />
            </div>
            <div className="mb-6">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <InputTextAreaNoLimitTypeMolecule
                    id="content"
                    title="내용"
                    {...field}
                    placeholder="내용을 입력하세요"
                    error={errors.content?.message}
                    hasError={!!errors.content}
                  />
                )}
              />
            </div>
            <div>
              {isValid ? (
                <LargeAbleButton text="작성" />
              ) : (
                <LargeDisableButton text="작성" />
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NoticeCreateTemplate;
