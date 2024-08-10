import React, { useRef, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import InputMask from "react-input-mask";
import ToggleButton from "../atoms/Button/ToggleButton";
import alarmWhite from "../../assets/images/alarm-clockwhite.png";
import alarmBlack from "../../assets/images/alarm-clockblack.png";
import meterWhite from "../../assets/images/meterwhite.png";
import meterBlack from "../../assets/images/meterblack.png";
import { getMyCrews } from "../../apis/api/mycrew";

interface ImageEditSaveProps {
  crewId: number;
  postImages: string[];
  isPublic: boolean;
  content: string;
  onFinish: (finalImage: string) => void;
}

const ImageEditSave: React.FC<ImageEditSaveProps> = ({
  crewId,
  postImages,
  onFinish,
}) => {
  const [totalDistance, setTotalDistance] = useState("00.00");
  const [totalTime, setTotalTime] = useState("00:00:00");
  const [pace, setPace] = useState("0'0''");

  const [showLogoInput, setShowLogoInput] = useState(false);
  const [showDistanceInput, setShowDistanceInput] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showPaceInput, setShowPaceInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);
  const [crewImageUrl, setCrewImageUrl] = useState<string | null>(null);

  const captureRef = useRef<HTMLDivElement>(null);

  async function fetchImageAsFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").pop() || "image.jpg";
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const response = await getMyCrews();
        const selectedCrew = response.crews.find(
          (crew) => crew.crewId === crewId
        );

        if (selectedCrew) {
          setCrewImageUrl(selectedCrew.subLogo);
          const crewImageUrl = selectedCrew.subLogo;

          const file = await fetchImageAsFile(crewImageUrl);
          console.log(file);

          const imageUrl = URL.createObjectURL(file);
          setCrewImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("크루 데이터 로딩 오류:", error);
      }
    };

    if (crewId) {
      fetchCrewData();
    }
  }, [crewId]);

  useEffect(() => {
    if (isValidTime(totalTime) && isValidDistance(totalDistance)) {
      const timeInSeconds = calculateTimeInSeconds(totalTime);
      const distanceInKm = parseFloat(totalDistance);

      if (timeInSeconds > 0 && distanceInKm > 0) {
        const paceInSeconds = timeInSeconds / distanceInKm;
        const paceMinutes = Math.floor(paceInSeconds / 60);
        const paceSeconds = Math.floor(paceInSeconds % 60);
        setPace(`${paceMinutes}'${paceSeconds}''`);
      } else {
        setPace("0'0''");
      }
    } else {
      setPace("0'0''");
    }
  }, [totalTime, totalDistance]);

  const isValidTime = (time: string): boolean => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(time);
  };

  const isValidDistance = (distance: string): boolean => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(distance);
  };

  const calculateTimeInSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":").map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleFinish = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
      });
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const finalImageUrl = URL.createObjectURL(blob);
            onFinish(finalImageUrl);
          }
        },
        "image/jpg",
        1
      );
    }
  };

  const handleSave = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
      });
      canvas.toBlob(
        (blob) => {
          if (blob) {
            saveAs(blob, "edited_image.jpg");
          }
        },
        "image/jpg",
        1
      );
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center mb-6">
        <div
          id="capture"
          ref={captureRef}
          className="relative mt-1"
          style={{
            maxWidth: "360px",
            maxHeight: "360px",
            border: "none",
            boxSizing: "border-box",
          }}
        >
          {postImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Cropped ${index}`} />
            </div>
          ))}
          {showLogoInput && crewImageUrl && (
            <div className="logo absolute top-2 left-2 overflow-hidden rounded-full w-16 h-16">
              <img
                src={crewImageUrl}
                alt="crew image"
                className="w-full h-full object-cover"
                style={{ borderRadius: "50%" }}
              />
            </div>
          )}
          <div className="absolute bottom-4 left-2 right-2 flex justify-around items-center">
            {showTimeInput && (
              <div className="flex items-center space-x-1">
                {showColorInput ? (
                  <img
                    src={alarmWhite}
                    alt="Alarm White"
                    className="info-icon w-6 h-6"
                  />
                ) : (
                  <img
                    src={alarmBlack}
                    alt="Alarm Black"
                    className="info-icon w-6 h-6"
                  />
                )}
                <p
                  className={`info-text font-semibold tracking-tighter ${
                    showColorInput ? "text-white" : "text-black"
                  } m-0`}
                >
                  {totalTime}
                </p>
              </div>
            )}
            {showDistanceInput && (
              <div className="flex items-center space-x-2">
                <p
                  className={`info-text font-semibold tracking-tighter ${
                    showColorInput ? "text-white" : "text-black"
                  } m-0`}
                >
                  {totalDistance} KM
                </p>
              </div>
            )}
            {showPaceInput && (
              <div className="flex items-center space-x-1">
                {showColorInput ? (
                  <img
                    src={meterWhite}
                    alt="Meter White"
                    className="info-icon w-6 h-6"
                  />
                ) : (
                  <img
                    src={meterBlack}
                    alt="Meter Black"
                    className="info-icon w-6 h-6"
                  />
                )}
                <p
                  className={`info-text font-semibold tracking-tighter ${
                    showColorInput ? "text-white" : "text-black"
                  } m-0`}
                >
                  {pace}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <label className="block text-md font-bold text-gray-700 mb-1">
          크루 로고
        </label>
        <div className="flex">
          <ToggleButton
            isActive={showLogoInput}
            onToggle={() => setShowLogoInput(!showLogoInput)}
          />
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <label className="block text-md font-bold text-gray-700 mb-1">
          소요 시간
        </label>
        <div className="flex items-center space-x-4">
          {showTimeInput && (
            <InputMask
              mask="99:99:99"
              maskChar="0"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
              placeholder="00:00:00"
              className="border border-gray-300 rounded px-3 py-2 w-24 h-8"
            />
          )}
          <ToggleButton
            isActive={showTimeInput}
            onToggle={() => setShowTimeInput(!showTimeInput)}
          />
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <label className="block text-md font-bold text-gray-700 mb-1">
          러닝 거리
        </label>
        <div className="flex items-center space-x-4">
          {showDistanceInput && (
            <InputMask
              mask="99.99"
              maskChar="0"
              value={totalDistance}
              onChange={(e) => setTotalDistance(e.target.value)}
              placeholder="00.00"
              className="border border-gray-300 rounded px-3 py-2 w-24 h-8"
            />
          )}
          <ToggleButton
            isActive={showDistanceInput}
            onToggle={() => setShowDistanceInput(!showDistanceInput)}
          />
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <label className="block text-md font-bold text-gray-700 mb-1">
          페이스
        </label>
        <div className="flex items-center space-x-4">
          {showPaceInput && (
            <InputMask
              mask="9'99''"
              maskChar="0"
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              placeholder="0'00''"
              className="border border-gray-300 rounded px-3 py-2 w-24 h-8"
            />
          )}
          <ToggleButton
            isActive={showPaceInput}
            onToggle={() => setShowPaceInput(!showPaceInput)}
          />
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <label className="block text-md font-bold text-gray-700 mb-1 mt-2">
          색상
        </label>
        <div className="flex items-center space-x-4">
          <ToggleButton
            isActive={showColorInput}
            onToggle={() => setShowColorInput(!showColorInput)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handleFinish}
          className="px-4 py-2 bg-[#2b2f40e6] text-white rounded"
        >
          완료
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#2b2f40e6] text-white rounded"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default ImageEditSave;
