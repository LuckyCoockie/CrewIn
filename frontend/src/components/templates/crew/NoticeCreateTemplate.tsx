// src/components/templates/NoticeCreateTemplate.tsx
import React, { useState, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import cropButton from "../../../assets/images/cropbutton.png";
import checkButton from "../../../assets/images/checkbutton.png";
import InputTextAreaNoLimitTypeMolecule from "../../molecules/Input/InputTextAreaNoLimitTypeMolecule";
import InputTextTypeMolecule from "../../molecules/Input/InputTextTypeMolecule";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import ImageUploadDropzone from "../../molecules/Input/ImageUploadDropzone";

const NoticeCreateTemplate: React.FC = () => {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cropAspectRatio] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);

  const [, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
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

  return (
    <div className="mx-auto w-full max-w-[550px] pt-4 pb-20">
      <div className="flex flex-col items-center justify-center">
        <div className="self-start">
          <BackHeaderMediumOrganism text="공지글 작성" />
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
                      </>
                    )}
                    <button
                      onClick={handleCropAll}
                      className="absolute bottom-2 right-3 bg-transparent z-1 p-1"
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

        <div className="w-full">
          <div className="mb-6">
            <InputTextTypeMolecule
              id="title"
              title="제목"
              placeholder="제목을 입력하세요"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {}}
              hasError={false}
            />
          </div>
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
          className={`w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg ${
            !isCropped ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } text-white font-bold`}
          disabled={!isCropped}
        >
          작성
        </button>
      </div>
    </div>
  );
};

export default NoticeCreateTemplate;
