import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { ReactCropperElement } from 'react-cropper';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import Modal from './Modal';
import ImageEditSave from './ImageEditSave';
import editButton from "../assets/images/editbutton.png";
import cropButton from "../assets/images/cropbutton.png";
import checkButton from "../assets/images/checkbutton.png";

interface ImageCropProps {
  onComplete: (croppedImages: string[], crewName: string, visibility: string, content: string) => void;
}

const ImageCrop: React.FC<ImageCropProps> = ({ onComplete }) => {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [cropAspectRatio] = useState<number>(1);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [crewName, setCrewName] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('전체');
  const [content, setContent] = useState<string>('');
  const [isCropped, setIsCropped] = useState<boolean>(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const cropperRefs = useRef<(ReactCropperElement | null)[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    const tempImagePaths: string[] = [];
    const tempCroppedImages: string[] = [];
    acceptedFiles.forEach(file => {
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
        width: 300,
        height: 300,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            setCroppedImages((prevImages) => {
              const newImages = [...prevImages];
              newImages[index] = croppedImageUrl;
              return newImages;
            });
          }
        }, 'image/jpeg', 0.8);
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
    onComplete(croppedImages, crewName, visibility, content);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="bg-white" style={{ width: '360px' }}>
        <h1 className="text-xl font-bold my-6 mx-3">게시글 작성</h1>

        {imagePaths.length === 0 ? (
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <section className="mb-4">
                <div
                  {...getRootProps()}
                  style={{
                    width: 360,
                    height: 360,
                    border: '1px solid lightgray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input {...getInputProps()} />
                  <PlusOutlined style={{ fontSize: '3rem' }} />
                </div>
              </section>
            )}
          </Dropzone>
        ) : (
          <>
            <Carousel showThumbs={false} showIndicators={true} showStatus={false} infiniteLoop={false} className="mb-6">
              {imagePaths.map((imagePath, index) => (
                <div key={index} className="relative">
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
                      <div style={{ width: 360, height: 360 }}>
                        <img
                          src={croppedImages[index]}
                          alt={`Cropped ${index}`}
                          style={{ width: 360, height: 360 }}
                        />
                      </div>
                      <button
                        onClick={() => setCurrentEditIndex(index)}
                        className="absolute bottom-0.5 right-0.5 no-background transform translate-x-5 translate-y-2"
                      >
                        <img src={editButton} alt="edit Button" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleCropAll}
                    className="absolute top-0.5 right-0.5 no-background transform translate-x-5 translate-y-0"
                  >
                    {isCropped ? <img src={cropButton} alt="crop Button" /> : <img src={checkButton} alt="check Button" />}
                  </button>
                </div>
              ))}
            </Carousel>
          </>
        )}

        <div className="ml-4">
          <div className="mb-4 flex items-center">
            <label className="block font-semibold mr-3">크루명</label>
            <input
              type="text"
              value={crewName}
              onChange={(e) => setCrewName(e.target.value)}
              placeholder="크루명을 입력하세요"
              className="border border-gray-300 rounded px-3 py-2 flex"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block mr-3 font-semibold">공개범위</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex"
            >
              <option value="전체">전체</option>
              <option value="크루">크루</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="border border-gray-300 rounded w-80 h-40 mx-auto px-4 py-3"
            />
          </div>
      </div>
        <button
          onClick={handlePost}
          className="w-5/6 text-white px-4 py-3 rounded font-semibold mx-auto block"
          style={{ width: 'calc(100% - 32px)' }}>
          작성
        </button>
        </div>


      {currentEditIndex !== null && (
        <Modal onClose={() => setCurrentEditIndex(null)}>
          <ImageEditSave
            images={[croppedImages[currentEditIndex]]}
            crewName={crewName}
            visibility={visibility}
            content={content}
            onFinish={handleFinishEdit}
          />
        </Modal>
      )}
    </div>
  );
};

export default ImageCrop;
