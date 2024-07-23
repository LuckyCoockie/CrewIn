import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Dropzone from "react-dropzone";
import { PlusOutlined } from "@ant-design/icons";
import ModalMolecules from "../molecules/ModalMolecules";
import ImageEditSave from "./ImageEditSaveOrganism";
import editButton from "../../assets/images/editbutton.png";
import cropButton from "../../assets/images/cropbutton.png";
import checkButton from "../../assets/images/checkbutton.png";
import InputTextAreaTypeMolecule from "../molecules/Input/InputTextAreaTypeMolecule";
import HeaderOrganism from "./HeaderOrganism";
import InputRadioTypeMolecule from "../molecules/Input/InputRadioTypeMolecule";
import InputDropdonwTypeMolecule from "../molecules/Input/InputDropdonwTypeMolecule";
import { crewNames } from "../../../src/crewname";

interface ImageCropProps {
  onComplete: (
    croppedImages: string[],
    crewName: string,
    visibility: string,
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
  const [crewName, setCrewName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("전체");
  const [content, setContent] = useState<string>("");
  const [isCropped, setIsCropped] = useState<boolean>(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    const tempImagePaths: string[] = [];
    const tempCroppedImages: string[] = [];
    acceptedFiles.forEach((file) => {
      const tempImagePath = URL.createObjectURL(file);
      tempImagePaths.push(tempImagePath);
      tempCroppedImages.push(tempImagePath);
    });
    setImagePaths(tempImagePaths);
    setCroppedImages(tempCroppedImages);
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
      setCroppedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[currentEditIndex] = finalImage;
        return newImages;
      });
      setCurrentEditIndex(null);
    }
  };

  const handlePost = () => {
    const postData = { croppedImages, crewName, visibility, content };
    onComplete(croppedImages, crewName, visibility, content);
    navigate("/postdetail", { state: postData });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="self-start">
        <HeaderOrganism text="게시글 작성" />
      </div>
      {imagePaths.length === 0 ? (
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="my-3">
              <div
                {...getRootProps()}
                style={{
                  width: 360,
                  height: 360,
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize: "3rem" }} />
              </div>
            </section>
          )}
        </Dropzone>
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
                      ref={(cropper) => {
                        cropperRefs.current[index] = cropper ? cropper : null;
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
                        className="absolute bottom-7 right-1 z-1 bg-transparent p-1"
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
                    className="absolute bottom-16 right-1 bg-transparent z-1 p-1"
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
        <InputDropdonwTypeMolecule
          id="crewName"
          title="크루"
          options={crewNames}
          value={crewName}
          onChange={(e) => setCrewName(e.target.value)}
          text="크루명을 선택하세요"
          hasError={false}
        />
      </div>

      <div className="w-full">
        <InputRadioTypeMolecule
          id="visibility"
          title="공개범위"
          name="visibility"
          onChange={(e) => setVisibility(e.target.value)}
          value={["전체", "크루"]}
          default="전체"
          hasError={false}
        />
      </div>

      <div className="w-full">
        <div className="mb-6">
          <InputTextAreaTypeMolecule
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
        className="w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg disable text-white font-bold"
      >
        작성
      </button>

      {currentEditIndex !== null && (
        <ModalMolecules onClose={() => setCurrentEditIndex(null)}>
          <ImageEditSave
            images={[originalCroppedImages[currentEditIndex]]}
            crewName={crewName}
            visibility={visibility}
            content={content}
            onFinish={handleFinishEdit}
          />
        </ModalMolecules>
      )}
    </div>
  );
};

export default ImageCrop;
