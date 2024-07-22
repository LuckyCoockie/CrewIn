import React, { useEffect, useState } from "react";
import "../../styles/square.css";
import { IconTextComponent } from "../atoms/text/IconText";

// 카드 컴포넌트의 Props 타입 정의
interface OwnProps {
  imageUrl: string;
  title: string;
  description: string;
  captain: string;
  location: string;
  peopleCount: number;
}

// 카드 컴포넌트 정의
const CrewListItem: React.FC<OwnProps> = ({
  imageUrl,
  title,
  description,
  captain,
  location,
  peopleCount,
}) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        console.log(blob);
        const url = URL.createObjectURL(blob);
        setImage(url);
      })
      .catch(() => {
        setImage(null);
      });

    // 컴포넌트 언마운트 시 URL 해제
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="max-w-sm rounded-xl border-4 border-primary shadow-lg bg-white">
      <div className="flex justify-center items-center bg-primary square md:p-5 p-4">
        {image ? (
          <img
            alt="crew image"
            src={image}
            className="rounded-full b border-4 border-white w-full"
          />
        ) : (
          <div className="rounded-full b border-4 border-white w-full m-10" />
        )}
      </div>
      <div className="m-3 md:m-4 ml-2">
        <div className="flex md:b-1 md:mb-2">
          <div className="flex items-center mr-2">
            <div className="h-full bg-highlight" style={{ width: 3 }}></div>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-gray-700 text-xl md:text-2xl truncate">
              {title}
            </p>
            <p className="text-gray-700 text-base text-sm md:text-md truncate">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-1">
          <IconTextComponent
            icon="./src/assets/icons/captain.png"
            text={captain}
          />
          <IconTextComponent
            icon="./src/assets/icons/location.png"
            text={location}
          />
          <IconTextComponent
            icon="./src/assets/icons/people.png"
            text={`${peopleCount}명`}
          />
        </div>
      </div>
    </div>
  );
};

export default CrewListItem;
