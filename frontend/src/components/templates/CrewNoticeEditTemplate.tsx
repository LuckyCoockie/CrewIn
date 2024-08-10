import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Carousel } from "react-responsive-carousel";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import InputTextAreaNoLimitTypeMolecule from "../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputTextTypeMolecule from "../molecules/Input/InputTextTypeMolecule";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import ImageUploadDropzone from "../molecules/Input/ImageUploadDropzone";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import cropButton from "../../assets/images/cropbutton.png";
import checkButton from "../../assets/images/checkbutton.png";

import { uploadImage } from "../../apis/api/presigned";
import {
  CrewNoticeDetailResponseDto,
  editNotice,
  getCrewNoticeDetail,
} from "../../apis/api/crewdetail";

import { useNavigate, useParams } from "react-router-dom";

import SpinnerFullComponent from "../atoms/SpinnerFullComponent";

// 유효성 검사 스키마 정의
const schema = yup.object({
  title: yup.string().required(),
  content: yup.string().required(),
});

type FormValues = {
  title: string;
  content: string;
};

const CrewNoticeEditTemplate: React.FC = () => {
  const { crewId, noticeId } = useParams<{
    crewId: string;
    noticeId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: noticeData } = useQuery<CrewNoticeDetailResponseDto, Error>(
    ["getNoticeInfo", crewId, noticeId],
    () =>
      getCrewNoticeDetail({
        crewId: Number(crewId),
        noticeId: Number(noticeId),
      })
  );

  const mutation = useMutation(editNotice, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getNoticeInfo", crewId, noticeId]);
      navigate(`/crew/detail/${crewId}/notice/${noticeId}`);
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });

  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cropAspectRatio] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  useEffect(() => {
    if (noticeData) {
      setValue("title", noticeData.title);
      setValue("content", noticeData.content);
      setImagePaths(noticeData.postImages); // 기존 이미지를 설정
      setCroppedImages(noticeData.postImages); // 기본 이미지로 크롭 이미지를 설정
    }
  }, [noticeData, setValue]);

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

  // 가져온 데이터 초기화 함수
  const handleClearImages = () => {
    setImagePaths([]);
    setCroppedImages([]);
    setCroppedFiles([]);
    setIsCropped(false);
  };

  const checkUndefined = async (files: File[]) => {
    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadImage(file);
        return result;
      });
      return Promise.all(uploadPromises);
    } else {
      return imagePaths; // 새로 업로드한 파일이 없다면 기존 이미지 경로를 반환
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!isValid) {
      console.log(isValid);
      console.log("막음");
      
      return;
    }
    setIsSubmitting(true);
    const urls = await checkUndefined(croppedFiles);

    const submitData = {
      noticeId: Number(noticeId),
      crewId: Number(crewId),
      title: data.title,
      content: data.content,
      noticeImages: urls,
    };

    await mutation.mutateAsync(submitData);
  };

  return (
    <div className="mx-auto w-full max-w-[550px]">
      {isSubmitting && <SpinnerFullComponent />}
      <div className="flex flex-col items-center justify-center">
        <header>
          <BackHeaderMediumOrganism text="공지글 수정" />
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
            <button
              onClick={handleClearImages}
              className="mt-2 button-color text-light p-2 rounded"
            >
              이미지 초기화
            </button>
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
                <LargeAbleButton text="수정" />
              ) : (
                <LargeDisableButton text="수정" />
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CrewNoticeEditTemplate;
