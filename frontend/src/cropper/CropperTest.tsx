import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { ReactCropperElement } from 'react-cropper';

const CropperTest: React.FC = () => {
  const [imagePath, setImagePath] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropAspectRatio, setCropAspectRatio] = useState<number | undefined>(1); // 초기 값은 1:1 비율로 설정
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
        width: 300,
        height: 300,
        maxWidth: 1920,
        maxHeight: 1080,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL('image/jpeg', 0.8);
        setCroppedImage(croppedImage);
      }
    }
  };

  const handleConfirm = () => {
    console.log('Confirmed cropped image:', croppedImage);
  };

  const changeAspectRatio = (aspectRatio: number) => {
    setCropAspectRatio(aspectRatio);
    cropperRef.current?.cropper.setAspectRatio(aspectRatio); // Cropper의 aspectRatio 변경
  };

  return (
    <div className="App">
      <h1>이미지 잘라부러~~!!</h1>
      <input type="file" onChange={handleChange} accept="image/*" />
      <br />
      {imagePath && (
        <>
          <Cropper
            src={imagePath}
            style={{ height: 400, width: '100%' }}
            aspectRatio={cropAspectRatio} // 선택한 비율로 설정
            guides={true}
            ref={cropperRef}
            viewMode={1} // Crop 영역을 이미지 내부로 제한
            autoCropArea={1} // Crop 영역을 이미지 내부로 자동으로 설정
          />
          <br />
          <div>
            <button onClick={() => changeAspectRatio(1)}>1:1</button>
            <button onClick={() => changeAspectRatio(3 / 2)}>3:2</button>
            {/* 원하는 비율의 버튼을 추가할 수 있습니다 */}
          </div>
          <br />
          <button onClick={handleCrop}>Crop</button>
          {croppedImage && (
            <>
              <h2>잘랐구먼유~~</h2>
              <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%', height: 'auto' }} />
              <br />
              <button onClick={handleConfirm}>확인</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CropperTest;
