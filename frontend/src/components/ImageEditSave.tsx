import React, { useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import InputMask from 'react-input-mask';

import alarmWhite from "../assets/images/alarm-clockwhite.png";
import alarmBlack from "../assets/images/alarm-clockblack.png";
import meterWhite from "../assets/images/meterwhite.png";
import meterBlack from "../assets/images/meterblack.png";

interface EditorStepProps {
  images: string[];
  crewName: string;
  visibility: string;
  content: string;
  onFinish: (finalImage: string) => void;
}

const ImageEditSave: React.FC<EditorStepProps> = ({
  images,
  crewName,
  visibility,
  content,
  onFinish
}) => {
  const [overlayTotalDistance, setOverlayTotalDistance] = useState("00.00");
  const [overlayTotalTime, setOverlayTotalTime] = useState("00:00:00");
  const [overlayPace, setOverlayPace] = useState("0'0''");
  const [topLeftImage, setTopLeftImage] = useState<string | null>(null);

  const [showLogoInput, setShowLogoInput] = useState(false);
  const [showDistanceInput, setShowDistanceInput] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showPaceInput, setShowPaceInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);

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

  const handleFinish = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {scale : 4 });
      canvas.toBlob((blob) => {
        if (blob) {
          const finalImageUrl = URL.createObjectURL(blob);
          onFinish(finalImageUrl);
        }
      }, 'image/jpg', 1);
    }
  };

  const handleSave = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {scale : 4 });
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'edited_image.jpg');
        }
      }, 'image/jpg', 1);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">총 시간:</label>
        <div className="flex items-center">
          {showTimeInput && (
            <InputMask
              mask="99:99:99"
              maskChar="0"
              value={overlayTotalTime}
              onChange={(e) => setOverlayTotalTime(e.target.value)}
              placeholder="00:00:00"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          )}
          <div
            className={`relative rounded-full w-12 h-6 transition-colors duration-200 ease-in-out ${showTimeInput ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setShowTimeInput(!showTimeInput)}
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
          >
            <div
              className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${showTimeInput ? 'translate-x-full bg-white' : 'bg-gray-500'}`}
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">총 거리:</label>
        <div className="flex items-center">
          {showDistanceInput && (
            <InputMask
              mask="99.99"
              maskChar="0"
              value={overlayTotalDistance}
              onChange={(e) => setOverlayTotalDistance(e.target.value)}
              placeholder="00.00"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          )}
          <div
            className={`relative rounded-full w-12 h-6 transition-colors duration-200 ease-in-out ${showDistanceInput ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setShowDistanceInput(!showDistanceInput)}
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
          >
            <div
              className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${showDistanceInput ? 'translate-x-full bg-white' : 'bg-gray-500'}`}
            />
          </div>
        </div>
      </div>


      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">페이스:</label>
        <div className="flex items-center">
          {showPaceInput && (
            <InputMask
              mask="9'99''"
              maskChar="0"
              value={overlayPace}
              onChange={(e) => setOverlayPace(e.target.value)}
              placeholder="0'00''"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          )}
          <div
            className={`relative rounded-full w-12 h-6 transition-colors duration-200 ease-in-out ${showPaceInput ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setShowPaceInput(!showPaceInput)}
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
          >
            <div
              className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${showPaceInput ? 'translate-x-full bg-white' : 'bg-gray-500'}`}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">로고:</label>
        <div className="flex items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleTopLeftImageUpload}
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <div
            className={`relative rounded-full w-12 h-6 transition-colors duration-200 ease-in-out ${showLogoInput ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setShowLogoInput(!showLogoInput)}
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
          >
            <div
              className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${showLogoInput ? 'translate-x-full bg-white' : 'bg-gray-500'}`}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">색상:</label>
        <div className="flex items-center">
          <div
            className={`relative rounded-full w-12 h-6 transition-colors duration-200 ease-in-out ${showColorInput ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setShowColorInput(!showColorInput)}
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
          >
            <div
              className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${showColorInput ? 'translate-x-full bg-white' : 'bg-gray-500'}`}
            />
          </div>
        </div>
      </div>

      <div
        id="capture"
        ref={captureRef}
        className="relative w-full max-w-lg h-auto bg-white mt-4 overflow-hidden"
        style={{ maxWidth: "360px", maxHeight: "360px" }}
      >
        <Carousel
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          infiniteLoop
          autoPlay={false}
          interval={5000}
        >
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Cropped ${index}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </Carousel>

        {showLogoInput && topLeftImage && (
          <div className="absolute top-2 left-2 overflow-hidden rounded-full w-16 h-16">
            <img
              src={topLeftImage}
              alt="Top Left"
              className="w-full h-full object-cover"
              style={{ borderRadius: "50%" }}
            />
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex justify-around">
          {showTimeInput && (
            <div className="flex items-center">
              {showColorInput ? (
                <img src={alarmWhite} alt="Alarm White" className="w-6 h-6 mr-2" />
              ) : (
                <img src={alarmBlack} alt="Alarm Black" className="w-6 h-6 mr-2" />
              )}
              <p className={`text-lg ${showColorInput ? "text-white" : "text-black"} m-0`}>{overlayTotalTime}</p>
            </div>
          )}
          {showDistanceInput && (
            <div className="flex items-center">
              <p className={`text-lg ${showColorInput ? "text-white" : "text-black"} m-0`}>{overlayTotalDistance}KM</p>
            </div>
          )}
          {showPaceInput && (
            <div className="flex items-center">
              {showColorInput ? (
                <img src={meterWhite} alt="Meter White" className="w-6 h-6 mr-2" />
              ) : (
                <img src={meterBlack} alt="Meter Black" className="w-6 h-6 mr-2" />
              )}
              <p className={`text-lg ${showColorInput ? "text-white" : "text-black"} m-0`}>{overlayPace}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleFinish}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        완료
      </button>

      <button
        onClick={handleSave}
        className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        저장
      </button>
    </div>
  );
};

export default ImageEditSave;
