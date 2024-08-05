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
        className="flex flex-col items-center py-2 cursor-pointer"
        onClick={props.onClick}
      >
        {props.tab ? (
          <>
            <CrewSelected />
            <p className="text-center text-xs font-bold">{props.name}</p>
          </>
        ) : (
          <>
            <CrewDeselected />
            <p className="text-center text-xs text-gray-500">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default CrewTabMolecule;
