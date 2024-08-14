import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import ModalMolecules from "../molecules/ModalMolecules";
import ImageEditSave from "./ImageEditSaveOrganism";
import { ReactComponent as CheckButton } from "../../assets/icons/checkButton.svg";
import { ReactComponent as CropButton } from "../../assets/icons/cropButton.svg";
import { ReactComponent as EditButton } from "../../assets/icons/editButton.svg";
import InputTextAreaNoLimitTypeMolecule from "../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputRadioTypeMolecule from "../molecules/Input/InputRadioTypeMolecule";
import InputDropdonwTypeMoleculeCenter from "../molecules/Input/InputDropdownTypeMoleculeLeft";
import ImageUploadDropzone from "../molecules/Input/ImageUploadDropzone";
import { createPost } from "../../apis/api/postcreate";
import { getMyCrews, CrewDto } from "../../apis/api/mycrew";
import { uploadImage } from "../../apis/api/presigned";
import Modal from "../molecules/ModalMolecules";
import SpinnerComponent from "../atoms/SpinnerComponent";

interface ImageCropProps {
  onComplete: (
    postImages: string[],
    crewId: number,
    isPublic: boolean,
    content: string
  ) => void;
}

const ImageCrop: React.FC<ImageCropProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cropAspectRatio] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [originalCroppedImages, setOriginalCroppedImages] = useState<string[]>(
    []
  );
  const [crewId, setCrewId] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [isCropped, setIsCropped] = useState<boolean>(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [crews, setCrews] = useState<CrewDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsWarningVisible] = useState<boolean>(true);

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await getMyCrews();
        setCrews(response.crews);
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId);
        }
      } catch (error) {
        setModalMessage("크루 정보를 불러오는 중 오류가 발생했습니다.");
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isPublic && crews.length > 0) {
      setCrewId(0);
    } else if (!isPublic && crews.length > 0) {
      setCrewId(crews[0].crewId);
    }
  }, [isPublic, crews]);

  const handleDrop = (acceptedFiles: File[]) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    const filteredFiles = acceptedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (imagePaths.length + filteredFiles.length > 10) {
      setModalMessage("사진은 최대 10개까지 첨부할 수 있습니다.");
      setIsModalOpen(true);
      return;
    }

    const tempImagePaths: string[] = [];
    const tempOriginalCroppedImages: string[] = [];

    filteredFiles.forEach((file) => {
      const tempImagePath = URL.createObjectURL(file);
      tempImagePaths.push(tempImagePath);
      tempOriginalCroppedImages.push(tempImagePath);
    });

    setImagePaths((prevPaths) => [...prevPaths, ...tempImagePaths]);
    setCroppedImages((prevImages) => [...prevImages, ...tempImagePaths]);
    setOriginalCroppedImages((prevImages) => [
      ...prevImages,
      ...tempOriginalCroppedImages,
    ]);
    setIsCropped(false);
    setIsWarningVisible(true);
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
          async (blob: Blob | null) => {
            if (blob) {
              const croppedImageUrl = URL.createObjectURL(blob);
              setCroppedImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = croppedImageUrl;
                return newImages;
              });
              setOriginalCroppedImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = croppedImageUrl;
                return newImages;
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
    setIsWarningVisible(false);
  };

  const handleFinishEdit = (finalImage: string) => {
    if (currentEditIndex !== null) {
      setCroppedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[currentEditIndex] = finalImage;
        return newImages;
      });
      setCurrentEditIndex(null);
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    try {
      const uploadedImages = await Promise.all(
        croppedImages.map(async (imageUrl) => {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "image.png", { type: blob.type });
          return uploadImage(file);
        })
      );

      const postData = {
        crewId: isPublic ? 0 : crewId,
        content,
        isPublic,
        postImages: uploadedImages,
      };

      const response = await createPost(postData);
      console.log("서버 응답:", response);
      onComplete(uploadedImages, crewId, isPublic, content);
      navigate("/home", { replace: true });
    } catch (error) {
      setModalMessage("게시글 작성 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImages = () => {
    setImagePaths([]);
    setCroppedImages([]);
    setOriginalCroppedImages([]);
    setIsCropped(false);
    setIsWarningVisible(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
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

                      <button
                        onClick={() => setCurrentEditIndex(index)}
                        className="absolute bottom-16 right-3 z-50 p-2 rounded-full bg-white bg-opacity-60"
                      >
                        <EditButton />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleCropAll}
                    className="absolute bottom-4 right-3 z-50 p-2 rounded-full bg-white bg-opacity-60"
                  >
                    {isCropped ? <CropButton /> : <CheckButton />}
                  </button>
                </div>
              ))}
            </Carousel>
          </div>
          {imagePaths.length > 0 && !isCropped && (
            <p className="mt-2 text-center text-xs text-red-600">
              *사진 편집을 완료해야 작성이 가능합니다. (체크 버튼을
              클릭해주세요.)
            </p>
          )}
          <button
            onClick={handleClearImages}
            className="mt-2 button-color text-light p-2 rounded"
          >
            이미지 초기화
          </button>
        </>
      )}
      <main>
        <div className="w-full flex mt-2">
          <div className="w-full">
            <InputRadioTypeMolecule
              id="visibility"
              title="공개 범위"
              name="visibility"
              onChange={(e) => setIsPublic(e.target.value === "전체")}
              value={["전체", "크루"]}
              default="전체"
              hasError={false}
            />
          </div>

          <div className="w-60 text-center">
            <InputDropdonwTypeMoleculeCenter
              id="crewId"
              title=""
              options={crews.map((crew) => ({
                label: crew.crewName,
                value: crew.crewId,
              }))}
              value={crewId}
              onChange={(e) => setCrewId(Number(e.target.value))}
              text={isPublic ? "크루 선택" : ""}
              hasError={false}
            />
          </div>
        </div>

        <div className="w-full mb-6">
          <InputTextAreaNoLimitTypeMolecule
            id="content"
            title="내용"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            hasError={false}
          />
        </div>

        <button
          onClick={handlePost}
          className={`w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg ${
            !isCropped || (!isPublic && crewId === 0)
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          } text-white font-bold`}
          disabled={!isCropped || (!isPublic && crewId === 0) || isLoading}
        >
          {isLoading ? <SpinnerComponent /> : "작성"}
        </button>

        {currentEditIndex !== null && (
          <ModalMolecules
            title="사진 편집"
            onClose={() => setCurrentEditIndex(null)}
          >
            <ImageEditSave
              postImages={[originalCroppedImages[currentEditIndex]]}
              crewId={crewId}
              isPublic={isPublic}
              content={content}
              onFinish={handleFinishEdit}
            />
          </ModalMolecules>
        )}

        {isModalOpen && (
          <Modal title="알림" onClose={handleModalClose}>
            <p>{modalMessage}</p>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default ImageCrop;
