import React from "react";
import HomeSelected from "../../atoms/Bottombar/HomeSelected";
import HomeDeselected from "../../atoms/Bottombar/HomeDeselected";

type Name = {
  name: string;
  tab: boolean;
  onClick: () => void;
};

const HomeTabMolecule: React.FC<Name> = (props) => {
  return (
    <>
      <div
        className="flex flex-col items-center py-2 hover:shadow-lg hover:scale-105 transform active:shadow-inner active:scale-95 transition duration-150 cursor-pointer"
        onClick={props.onClick}
      >
        {props.tab ? (
          <>
            <HomeSelected />
            <p className="text-center text-xs font-bold">{props.name}</p>
          </>
        ) : (
          <>
            <HomeDeselected />
            <p className="text-center text-xs text-gray-500">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default HomeTabMolecule;
