import React from "react";
import CrewSelected from "../../atoms/Bottombar/CrewSelected";
import CrewDeselected from "../../atoms/Bottombar/CrewDeselected";

type Name = {
  name: string;
  tab: boolean;
  onClick: () => void;
};

const CrewTabMolecule: React.FC<Name> = (props) => {
  return (
    <>
      <div
        className="p-7 lg:pr-10 flex flex-col lg:flex-row items-center py-2 lg:py-4 hover:scale-105 transform active:scale-90 transition cursor-pointer button"
        onClick={props.onClick}
        onTouchEnd={props.onClick}
      >
        {props.tab ? (
          <>
            <CrewSelected />
            <p className="text-center text-xs lg:text-base font-bold lg:pl-2">{props.name}</p>
          </>
        ) : (
          <>
            <CrewDeselected />
            <p className="text-center text-xs lg:text-base text-gray-500 lg:pl-2">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default CrewTabMolecule;
