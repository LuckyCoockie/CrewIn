import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { ReactCropperElement } from 'react-cropper';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const tempImagePaths: string[] = [];
      const tempCroppedImages: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const tempImagePath = URL.createObjectURL(e.target.files[i]);
        tempImagePaths.push(tempImagePath);
        tempCroppedImages.push(tempImagePath);
      }
      setImagePaths(tempImagePaths);
      setCroppedImages(tempCroppedImages);
      setIsCropped(false);
    }
  };

  const handleCrop = (index: number) => {
    const cropperRef = cropperRefs.current[index];
    if (cropperRef && cropperRef.cropper) {
      const cropper = cropperRef.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 1080,
        height: 1080,
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">게시글 작성</h1>

        <input
          type="file"
          onChange={handleChange}
          accept="image/*"
          multiple
          className="mb-4"
        />

        {imagePaths.length > 0 && (
          <>
            <button
              onClick={handleCropAll}
              className="px-4 py-2 bg-blue-500 text-white rounded mb-4 w-full"
            >
              {isCropped ? '다시 크롭하기' : '전체 이미지 크롭'}
            </button>
            <Carousel showThumbs={false} infiniteLoop={true} className="mb-6">
              {imagePaths.map((imagePath, index) => (
                <div key={index} className="relative">
                  {!isCropped ? (
                    <Cropper
                      src={imagePath}
                      style={{ height: 400, width: '100%' }}
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
                      <div style={{ width: 400, height: 400, overflow: 'hidden', margin: '0 auto' }}>
                        <img
                          src={croppedImages[index]}
                          alt={`Cropped ${index}`}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                      <button
                        onClick={() => setCurrentEditIndex(index)}
                        className="absolute bottom-4 right-4 px-2 py-1 text-white rounded"
                      >
                        사진 편집
                      </button>
                    </>
                  )}
                </div>
              ))}
            </Carousel>
          </>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-semibold">크루명:</label>
          <input
            type="text"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            placeholder="크루명"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">공개범위:</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
            className="w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none"
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
