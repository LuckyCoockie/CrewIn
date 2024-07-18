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
    console.log(finalImage);

    if (currentEditIndex !== null) {
      setCroppedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[currentEditIndex] = finalImage;
        return newImages;
      });
      setCurrentEditIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screenp-4">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>

        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="mb-4">
              <div
                {...getRootProps()}
                style={{
                  width: 300,
                  height: 300,
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

        {imagePaths.length > 0 && (
          <>
            <Carousel showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop={false} className="mb-6">
              {imagePaths.map((imagePath, index) => (
                <div key={index} className="relative">
                  {!isCropped ? (
                    <Cropper
                      src={imagePath}
                      style={{ height: 300, width: 300 }}
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
                      <div style={{ width: 300, height: 300 }}>
                        <img
                          src={croppedImages[index]}
                          alt={`Cropped ${index}`}
                          style={{ width: 300, height: 300 }}
                        />
                      </div>
                      <button
                        onClick={() => setCurrentEditIndex(index)}
                        className="absolute bottom-4 left-4 px-2 py-1 text-white rounded"
                      >
                        사진 편집
                      </button>
                    </>
                  )}
                </div>
              ))}
            </Carousel>
            <button
              onClick={handleCropAll}
              className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
              {isCropped ? '다시 크롭하기' : '전체 이미지 크롭'}
            </button>
          </>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-semibold">크루명:</label>
          <input
            type="text"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            placeholder="크루명"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">공개범위:</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="전체">전체</option>
            <option value="크루">크루</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용 입력"
            className="border border-gray-300 rounded px-3 py-2 h-32"
          />
        </div>
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
