import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import alarmWhite from '../images/alarm-clockwhite.png';
import meterWhite from '../images/meterwhite.png';

interface EditorStepProps {
  image: string;
  onPrevious: () => void;
}

const EditorStep: React.FC<EditorStepProps> = ({ image, onPrevious }) => {
  const [overlayTotalDistance, setOverlayTotalDistance] = useState('00.00KM');
  const [overlayTotalTime, setOverlayTotalTime] = useState('00:00:00');
  const [overlayPace, setOverlayPace] = useState("0'0''");
  const [topLeftImage, setTopLeftImage] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleTopLeftImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTopLeftImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current, {
        scale: 6,
        useCORS: true,
        backgroundColor: null,
      }).then((canvas) => {
        saveImg(canvas.toDataURL('image/jpeg', 1.0), 'image.jpg');
      });
    }
  };

  const saveImg = (uri: string, filename: string) => {
    const link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button
        onClick={onPrevious}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        이전
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleTopLeftImageUpload}
        className="my-4"
      />
      <input
        type="text"
        value={overlayTotalDistance}
        onChange={(e) => setOverlayTotalDistance(e.target.value)}
        placeholder="총 거리"
        className="border border-gray-300 rounded px-3 py-2 my-2"
      />
      <input
        type="text"
        value={overlayTotalTime}
        onChange={(e) => setOverlayTotalTime(e.target.value)}
        placeholder="총 시간"
        className="border border-gray-300 rounded px-3 py-2 my-2"
      />
      <input
        type="text"
        value={overlayPace}
        onChange={(e) => setOverlayPace(e.target.value)}
        placeholder="페이스"
        className="border border-gray-300 rounded px-3 py-2 my-2"
      />

      <div
        id="capture"
        ref={captureRef}
        style={{
          position: 'relative',
          width: '360px',
          height: '360px',
          backgroundColor: 'white',
        }}
      >
        <img src={image} alt="Cropped" style={{ width: '100%', height: '100%' }} />
        {topLeftImage && (
          <img
            src={topLeftImage}
            alt="Top Left"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              zIndex: 10,
            }}
          />
        )}
        <img
          src={alarmWhite}
          alt="Bottom Left"
          style={{
            position: 'absolute',
            bottom: '22px',
            left: '20px',
            width: '5%',
            height: '5%',
            zIndex: 10,
          }}
        />
        <img
          src={meterWhite}
          alt="Bottom Right"
          style={{
            position: 'absolute',
            bottom: '22px',
            right: '60px',
            width: '5%',
            height: '5%',
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '40px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          {overlayTotalTime}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '45%',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            paddingRight: '1rem',
          }}
        >
          {overlayTotalDistance}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '305px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          {overlayPace}
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        다운로드
      </button>
    </div>
  );
};

export default EditorStep;
