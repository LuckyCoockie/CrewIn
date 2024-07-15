import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import alarmWhite from "../images/alarm-clockwhite.png";
import alarmBlack from "../images/alarm-clockblack.png";
import meterWhite from "../images/meterwhite.png";
import meterBlack from "../images/meterblack.png";

const ImageEditor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [overlayTotalDistance, setOverlayTotalDistance] = useState("00.00KM");
  const [overlayTotalTime, setOverlayTotalTime] = useState("00:00:00");
  const [overlayPace, setOverlayPace] = useState("0'0''");
  const [topRightImage, setTopRightImage] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTopRightImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTopRightImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current, {
        scale: 6,
        useCORS: true,
        backgroundColor: null, // 배경색을 투명하게 설정
      }).then((canvas) => {
        saveImg(canvas.toDataURL("image/jpeg", 1.0), "image.jpg");
      });
    }
  };

  const saveImg = (uri: string, filename: string) => {
    const link = document.createElement("a");
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <input
        type="file"
        accept="image/*"
        onChange={handleTopRightImageUpload}
      />
      <input
        type="text"
        value={overlayTotalDistance}
        onChange={(e) => setOverlayTotalDistance(e.target.value)}
        placeholder="Enter text"
      />
      <input
        type="text"
        value={overlayTotalTime}
        onChange={(e) => setOverlayTotalTime(e.target.value)}
        placeholder="Enter text"
      />
      <input
        type="text"
        value={overlayPace}
        onChange={(e) => setOverlayPace(e.target.value)}
        placeholder="Enter text"
      />

      <div
        id="capture"
        ref={captureRef}
        style={{
          position: "relative",
          width: "360px",
          height: "360px",
          backgroundColor: "white", // 배경색을 설정
        }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Uploaded"
            style={{ width: "100%", height: "100%" }}
          />
        )}
        <>
          {topRightImage && (
            <img
              src={topRightImage}
              alt="Top Left"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "12%",
                height: "12%",
                zIndex: 10,
              }}
            />
          )}
          {alarmWhite && (
            <img
              src={alarmWhite}
              alt="Bottom Left"
              style={{
                position: "absolute",
                bottom: "22px",
                left: "20px",
                width: "5%",
                height: "5%",
                zIndex: 10,
              }}
            />
          )}
          {meterWhite && (
            <img
              src={meterWhite}
              alt="Bottom Right"
              style={{
                position: "absolute",
                bottom: "22px",
                right: "60px",
                width: "5%",
                height: "5%",
                zIndex: 10,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "40px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {overlayTotalTime}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "45%",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              paddingRight: "1rem",
            }}
          >
            {overlayTotalDistance}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "305px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {overlayPace}
          </div>
        </>
      </div>
      <button onClick={handleDownload}>Download Image</button>
    </div>
  );
};

export default ImageEditor;
