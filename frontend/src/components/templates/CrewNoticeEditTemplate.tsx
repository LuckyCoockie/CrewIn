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
import { ReactComponent as CheckButton } from "../../assets/icons/checkButton.svg";
import { ReactComponent as CropButton } from "../../assets/icons/cropButton.svg";

import { uploadImage } from "../../apis/api/presigned";
import {
  CrewNoticeDetailResponseDto,
  editNotice,
  getCrewNoticeDetail,
} from "../../apis/api/crewdetail";

import { useNavigate, useParams } from "react-router-dom";

import Modal from "../molecules/ModalMolecules";

// 유효성 검사 스키마 정의
const schema = yup.object({
  title: yup.string().required("제목을 입력해주세요."),
  content: yup.string().required("내용을 입력해주세요."),
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 오류 메시지 상태 추가
  const [isWarningVisible, setIsWarningVisible] = useState<boolean>(true); // 경고 메시지 상태 추가

  const { data: noticeData } = useQuery<CrewNoticeDetailResponseDto, Error>(
    ["getNoticeInfo", crewId, noticeId],
    () =>
      getCrewNoticeDetail({
        crewId: Number(crewId),
        noticeId: Number(noticeId),
      }),
    {
      onError: () => {
        setErrorMessage("공지 정보를 불러오는 중 오류가 발생했습니다.");
      },
    }
  );

  const mutation = useMutation(editNotice, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getNoticeInfo", crewId, noticeId]);
      navigate(`/crew/detail/${crewId}/notice/${noticeId}`, { replace: true });
    },
    onError: () => {
      setErrorMessage("공지 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false); // 로딩 상태 종료
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
  });

  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cropAspectRatio] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  const [isFilesChanged, setIsFilesChanged] = useState(false);

  useEffect(() => {
    if (noticeData) {
      setValue("title", noticeData.title);
      setValue("content", noticeData.content);
      setImagePaths(noticeData.postImages);
      setCroppedImages(noticeData.postImages);
    }
  }, [noticeData, setValue]);

  const handleDrop = (acceptedFiles: File[]) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    const filteredFiles = acceptedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (imagePaths.length + filteredFiles.length > 10) {
      setErrorMessage("사진은 최대 10개까지 첨부할 수 있습니다.");
      return;
    }
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
    setIsFilesChanged(true);
    setIsWarningVisible(true); // 경고 메시지 표시
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
    setIsWarningVisible(false); // 경고 메시지 숨기기
  };

  const handleClearImages = () => {
    setImagePaths([]);
    setCroppedImages([]);
    setCroppedFiles([]);
    setIsCropped(false);
    setIsFilesChanged(false);
    setIsWarningVisible(true); // 경고 메시지 표시
  };

  const checkUndefined = async (files: File[]) => {
    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadImage(file);
        return result;
      });
      return Promise.all(uploadPromises);
    } else {
      return imagePaths;
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    if (!isValid && !isFilesChanged) {
      setIsSubmitting(false);
      return;
    }
    try {
      const urls = await checkUndefined(croppedFiles);

      const submitData = {
        noticeId: Number(noticeId),
        crewId: Number(crewId),
        title: data.title,
        content: data.content,
        noticeImages: urls,
      };

      await mutation.mutateAsync(submitData);
    } catch (error) {
      setErrorMessage("공지 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto w-full max-w-[500px]">
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
                      className="absolute bottom-8 right-3 z-1 p-2 rounded-full bg-white bg-opacity-50"
                    >
                      {isCropped ? <CropButton /> : <CheckButton />}
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
          {isWarningVisible && (
            <p className="mt-2 text-center text-xs text-red-600">
              *사진 편집을 완료해야 작성이 가능합니다. (체크 버튼을 클릭해주세요.)
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 mt-2">
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
              {isValid || isFilesChanged ? (
                <LargeAbleButton text="수정" isLoading={isSubmitting} />
              ) : (
                <LargeDisableButton text="수정" />
              )}
            </div>
          </form>
        </main>
      </div>
      {errorMessage && (
        <Modal title="알림" onClose={closeModal}>
          <p>{errorMessage}</p>
        </Modal>
      )}
    </div>
  );
};

export default CrewNoticeEditTemplate;
