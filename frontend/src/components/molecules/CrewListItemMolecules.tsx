import "../../styles/square.css";
import { IconTextComponent } from "../atoms/text/IconText";
import React from "react";

import captainImage from "../../assets/icons/captain.png";
import locationImage from "../../assets/icons/location.png";
import peopleImage from "../../assets/icons/people.png";
import crewInLogoImage from "../../assets/images/crewinlogo.png";
import { useNavigate } from "react-router";

interface OwnProps {
  crewId: number;
  mainLogo: string;
  title: string;
  description: string;
  captain: string;
  location: string;
  peopleCount: number;
}

const CrewListItem = ({
  mainLogo,
  title,
  description,
  captain,
  location,
  peopleCount,
  crewId,
}: OwnProps) => {
  const navigate = useNavigate();

  const handleCrewDetail = (crewId: number) => {
    navigate(`/crew/detail/${crewId}`);
  };

  return (
    <div className="max-w-sm rounded-lg border-[2px] xs:border-2 border-primary bg-white tracking-tighter truncate">
      <div
        className="flex justify-center items-center bg-primary xs:p-4 p-3"
        onClick={() => handleCrewDetail(crewId)}
      >
        <div className="square">
          <img
            alt="crew image"
            src={mainLogo || crewInLogoImage}
            className="rounded-full b border xs:border-2 border-white w-full"
          />
        </div>
      </div>
      <div className="m-2 xs:m-4 ml-2">
        <div className="flex mb-1 xs:mb-2">
          <div className="flex items-center mr-2">
            <div className="w-[3px] xs:w-1 h-full bg-highlight" />
          </div>
          <div className="overflow-hidden">
            <p
              className="font-bold text-gray-700 text-xl xs:text-xl truncate"
              style={{ lineHeight: "0.9em" }}
            >
              {title}
            </p>
            <p className="text-gray-700 text-base text-sm xs:text-md truncate">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-1">
          <IconTextComponent icon={captainImage} text={captain} />
          <IconTextComponent icon={locationImage} text={location} />
          <IconTextComponent icon={peopleImage} text={`${peopleCount}명`} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CrewListItem);
