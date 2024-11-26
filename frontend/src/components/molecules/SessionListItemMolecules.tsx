import { useMemo } from "react";
import "../../styles/square.css";
import React from "react";
import sessionLogoImage from "../../assets/images/sessionLogo.png";
import { ReactComponent as Sessionpeople } from "../../assets/icons/sessinpeople.svg";

interface OwnProps {
  max?: number;
  current?: number;
  crewName?: string;
  area: string;
  date: string;
  imageUrl: string;
  title: string;
}

const SessionListItem = ({
  title,
  area,
  date,
  imageUrl,
  current,
  max,
}: OwnProps) => {
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
    <div className="max-w-sm rounded-lg border-primary bg-primary tracking-tighter truncate relative">
      <div className="flex justify-center items-center p-[6px] xs:p-2 relative">
        <div className="square relative">
          <img
            alt="session image"
            src={imageUrl || sessionLogoImage}
            className={`border xs:border-2 w-full ${
              current! >= max! ? "grayscale" : ""
            }`}
          />
          {current && max && (
            <div className="absolute top-1 right-1 border rounded-xl bg-white flex h-4 xs:h-5 px-1 justify-center items-center shadow-sm bg-opacity-85 border-opacity-85">
              <div className="me-1">
                <Sessionpeople />
              </div>
              <div className="text-[10px] xs:text-sm font-bold ">
                {current} / {max}
              </div>
            </div>
          )}
          {current! >= max! && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <p className="text-white text-xl font-bold">모집 마감</p>
            </div>
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
              {title.length > 10 ? `${title.substring(0, 9)}...` : title}
            </p>
            <p className="text-gray-300 text-[10px] xs:text-xs sm:text-sm truncate">
              {area}
            </p>
          </div>
          <div className="text-right items-center w-[1/3]">
            <p
              className="text-gray-300 text-[10px] xs:text-xs sm:text-sm truncate"
              style={{ lineHeight: "1em" }}
            >
              {parsedDate}
            </p>
            <p
              className="text-gray-300 text-[10px] xs:text-xs sm:text-sm truncate"
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
