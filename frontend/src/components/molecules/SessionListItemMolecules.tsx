import { useEffect, useMemo, useState } from "react";
import "../../styles/square.css";
import React from "react";
import sessionLogoImage from "../../assets/images/sessionLogo.png";

interface OwnProps {
  crewName: string;
  area: string;
  date: string;
  imageUrl: string;
}

const SessionListItem = ({ crewName, area, date, imageUrl }: OwnProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImage(url);
      })
      .catch(() => {
        setImage(null);
      });

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const parsedDate = useMemo(() => {
    const temp = new Date(Date.parse(date));
    const year = temp.getFullYear();
    const month = String(temp.getMonth() + 1).padStart(2, "0");
    const day = String(temp.getDate()).padStart(2, "0");
    return `${year % 100}.${month}.${day}`;
  }, [date]);

  const parsedTime = useMemo(() => {
    const temp = new Date(Date.parse(date));
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][temp.getDay()];
    const hours = String(temp.getHours()).padStart(2, "0");
    const minutes = String(temp.getMinutes()).padStart(2, "0");
    return `(${dayOfWeek}) ${hours}:${minutes}`;
  }, [date]);

  return (
    <div className="max-w-sm rounded-lg border-primary bg-primary tracking-tighter truncate">
      <div className="flex justify-center items-center p-[6px] xs:p-2">
        <div className="square">
          {image ? (
            <img
              alt="session image"
              src={image}
              className="b border xs:border-2 border-white w-full"
            />
          ) : (
            <img
              alt="session image"
              src={sessionLogoImage}
              className="b border xs:border-2 border-white w-full"
            />
          )}
        </div>
      </div>
      <div className="mt-[3px] m-2 xs:mt-2">
        <div className="flex justify-between items-center mb-1 xs:mb-2">
          <div className="mr-2 overflow-hidden w-[2/3]">
            <p
              className="text-white font-bold text-xs xs:text-base truncate"
              style={{ lineHeight: "1em" }}
            >
              {crewName}
            </p>
            <p className="text-white text-[10px] xs:text-xs sm:text-sm truncate">
              {area}
            </p>
          </div>
          <div className="text-right items-center w-[1/3]">
            <p
              className="text-white text-[10px] xs:text-xs sm:text-sm truncate"
              style={{ lineHeight: "1em" }}
            >
              {parsedDate}
            </p>
            <p
              className="text-white text-[10px] xs:text-xs sm:text-sm truncate"
              style={{ lineHeight: "1em" }}
            >
              {parsedTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SessionListItem);
