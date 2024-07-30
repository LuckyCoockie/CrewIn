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
  const [postImages, setPostImages] = useState<string[]>([]);
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
    const fetchCrews = async () => {
      try {
        const response = await getMyCrews();
        setCrews(response.data.crews);
      } catch (error) {
        console.error("크루 목록 조회 오류:", error);
      }
    };
    fetchCrews();
  }, []);

  const handleDrop = (acceptedFiles: File[]) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    const filteredFiles = acceptedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const tempImagePaths: string[] = [];
    const tempPostImages: string[] = [];

    filteredFiles.forEach((file) => {
      const tempImagePath = URL.createObjectURL(file);
      tempImagePaths.push(tempImagePath);
      tempPostImages.push(tempImagePath);
    });

    setImagePaths(tempImagePaths);
    setPostImages(tempPostImages);
    setOriginalCroppedImages(tempImagePaths);
    setIsCropped(false);
  };

  const handleCrop = (index: number) => {
    const cropperRef = cropperRefs.current[index];
    if (cropperRef && cropperRef.cropper) {
      const cropper = cropperRef.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 360,
        height: 360,
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const croppedImageUrl = URL.createObjectURL(blob);
              setPostImages((prevImages) => {
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
          0.8
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
      setPostImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[currentEditIndex] = finalImage;
        return newImages;
      });
      setCurrentEditIndex(null);
    }
  };

  const handlePost = async () => {
    const postData = {
      postImages,
      crewId,
      isPublic,
      content,
    };

    console.log("작성할 데이터:", postData);

    try {
      const response = await createPost(postData);
      console.log("서버 응답:", response);
      onComplete(postImages, crewId, isPublic, content);
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
                          src={postImages[index]}
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

        {isPublic === false && (
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
              text="크루 선택"
              hasError={false}
            />
          </div>
        )}
      </div>

      <div className="w-full">
        <div className="mb-6">
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
      </div>

      <button
        onClick={handlePost}
        className={`w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg ${
          !isCropped ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } text-white font-bold`}
        disabled={!isCropped}
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
