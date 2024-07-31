import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import ModalMolecules from "../molecules/ModalMolecules";
import ImageEditSave from "./ImageEditSaveOrganism";
import editButton from "../../assets/images/editbutton.png";
import cropButton from "../../assets/images/cropbutton.png";
import checkButton from "../../assets/images/checkbutton.png";
import InputTextAreaNoLimitTypeMolecule from "../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputRadioTypeMolecule from "../molecules/Input/InputRadioTypeMolecule";
import InputDropdonwTypeMolecule from "../molecules/Input/InputDropdonwTypeMolecule";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import ImageUploadDropzone from "../molecules/Input/ImageUploadDropzone";
import { createPost } from "../../apis/api/postcreate";
import { getMyCrews, CrewDto } from "../../apis/api/mycrew";
import { uploadImage } from "../../apis/api/presigned";

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

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getMyCrews();
        setCrews(response.crews);
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId);
        }
      } catch (error) {
        console.error("내가 속한 크루 조회 오류:", error);
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
    const allowedTypes = ["image/png", "image/jpeg"];
    const filteredFiles = acceptedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const tempImagePaths: string[] = [];
    const tempOriginalCroppedImages: string[] = [];

    filteredFiles.forEach((file) => {
      const tempImagePath = URL.createObjectURL(file);
      tempImagePaths.push(tempImagePath);
      tempOriginalCroppedImages.push(tempImagePath);
    });

    setImagePaths(tempImagePaths);
    setCroppedImages(tempImagePaths); // Save as cropped images initially
    setOriginalCroppedImages(tempOriginalCroppedImages);
    setIsCropped(false);
  };

  const handleCrop = (index: number) => {
    const cropperRef = cropperRefs.current[index];
    if (cropperRef && cropperRef.cropper) {
      const cropper = cropperRef.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        // width: 360,
        // height: 360,
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

      console.log("작성할 데이터:", postData);

      const response = await createPost(postData);
      console.log("서버 응답:", response);
      onComplete(uploadedImages, crewId, isPublic, content);
      navigate("/home", { state: postData });
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="self-start">
        <BackHeaderMediumOrganism text="게시글 작성" />
      </div>
      {imagePaths.length === 0 ? (
        <ImageUploadDropzone onDrop={handleDrop} />
      ) : (
        <>
          <div
            className="relative w-full bg-white rounded-lg mb-6"
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
                <div key={index} className="relative my-2">
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
                        className="absolute bottom-5 right-3 z-1 bg-transparent p-1"
                      >
                        <img
                          src={editButton}
                          alt="edit Button"
                          className="w-10 h-10"
                        />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleCropAll}
                    className="absolute bottom-14 right-3 bg-transparent z-1 p-1"
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

      <div className="w-full flex">
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

        <div className="w-60">
          <InputDropdonwTypeMolecule
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
        disabled={!isCropped || (!isPublic && crewId === 0)}
      >
        작성
      </button>

      {currentEditIndex !== null && (
        <ModalMolecules onClose={() => setCurrentEditIndex(null)}>
          <ImageEditSave
            postImages={[originalCroppedImages[currentEditIndex]]}
            crewId={crewId}
            isPublic={isPublic}
            content={content}
            onFinish={handleFinishEdit}
          />
        </ModalMolecules>
      )}
    </div>
  );
};

export default ImageCrop;
