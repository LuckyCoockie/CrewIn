import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { ReactCropperElement } from 'react-cropper';

interface CropperStepProps {
  onNext: (croppedImage: string | null) => void;
}

const CropperStep: React.FC<CropperStepProps> = ({ onNext }) => {
  const [imagePath, setImagePath] = useState<string>('');
  const [cropAspectRatio, setCropAspectRatio] = useState<number>(1);
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const tempImagePath = URL.createObjectURL(e.target.files[0]);
      setImagePath(tempImagePath);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: cropAspectRatio === 1 ? 1080 : 1620,
        height: 1080,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL('image/jpeg', 0.8);
        onNext(croppedImage);
      }
    }
  };

  const changeAspectRatio = (aspectRatio: number) => {
    setCropAspectRatio(aspectRatio);
    cropperRef.current?.cropper.setAspectRatio(aspectRatio);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-lg w-full p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">이미지 업로드 및 자르기</h1>
        <input 
          type="file" 
          onChange={handleChange} 
          accept="image/*" 
          className="mb-4"
        />
        {imagePath && (
          <>
            <Cropper
              src={imagePath}
              style={{ height: 400, width: '100%' }}
              aspectRatio={cropAspectRatio}
              guides={true}
              ref={cropperRef}
              viewMode={1}
              autoCropArea={1}
            />
            <div className="flex justify-around my-4">
              <button 
                onClick={() => changeAspectRatio(1)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                1:1
              </button>
              <button 
                onClick={() => changeAspectRatio(3 / 2)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                3:2
              </button>
            </div>
            <button 
              onClick={handleCrop}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              다음
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CropperStep;
