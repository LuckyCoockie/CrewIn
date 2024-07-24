import { useEffect, useMemo, useState } from "react";
import "../../styles/square.css";
import React from "react";

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
    return new Date(Date.parse(date)).toString();
  }, [date]);

  const parsedTime = useMemo(() => {
    return new Date(Date.parse(date)).toString();
  }, [date]);

  return (
    <div className="max-w-sm rounded-lg border-primary bg-primary tracking-tighter truncate">
      <div className="flex justify-center items-center square p-[6px] md:p-2">
        {image ? (
          <img
            alt="crew image"
            src={image}
            className="b border md:border-2 border-white w-full"
          />
        ) : (
          <img
            alt="crew image"
            src={"./src/assets/images/crewinlogo.png"}
            className="b border md:border-2 border-white w-full"
          />
        )}
      </div>
      <div className="m-1 md:m-2">
        <div className="flex justify-between items-center flex mb-1 md:mb-2 overflow-hidden">
          <div className="left-element">
            <p
              className="font-bold text-white text-md md:text-lg truncate"
              style={{ lineHeight: "0.8em" }}
            >
              {crewName}
            </p>
            <p className="text-white text-base text-sm md:text-md truncate">
              {area}
            </p>
          </div>
          <div className="right-element">
            <div className="items-center mr-2">
              <p
                className="text-white text-base text-sm md:text-md truncate"
                style={{ lineHeight: "0.8em" }}
              >
                {parsedDate}
              </p>
              <p className="text-white text-base text-sm md:text-md truncate">
                {parsedTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SessionListItem);
