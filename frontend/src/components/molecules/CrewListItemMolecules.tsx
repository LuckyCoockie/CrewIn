import { useEffect, useState } from "react";
import "../../styles/square.css";
import { IconTextComponent } from "../atoms/text/IconText";

interface OwnProps {
  imageUrl: string;
  title: string;
  description: string;
  captain: string;
  location: string;
  peopleCount: number;
}

const CrewListItem = ({
  imageUrl,
  title,
  description,
  captain,
  location,
  peopleCount,
}: OwnProps) => {
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

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="max-w-sm rounded-xl border-2 md:border-4 border-primary bg-white tracking-tighter">
      <div className="flex justify-center items-center bg-primary square md:p-4 p-3">
        {image ? (
          <img
            alt="crew image"
            src={image}
            className="rounded-full b border-2 md:border-4 border-white w-full"
          />
        ) : (
          <img
            alt="crew image"
            src={"./src/assets/images/crewinlogo.png"}
            className="rounded-full b border-2 md:border-4 border-white w-full"
          />
        )}
      </div>
      <div className="m-3 md:m-4 ml-2">
        <div className="flex md:b-1 md:mb-2">
          <div className="flex items-center mr-2">
            <div className="w-[3px] md:w-1 h-full bg-highlight"></div>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-gray-700 text-xl md:text-xl truncate">
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
