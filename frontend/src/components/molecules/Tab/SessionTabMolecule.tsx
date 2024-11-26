import React from "react";
import SessionSelected from "../../atoms/Bottombar/SessionSelected";
import SessionDeselected from "../../atoms/Bottombar/SessionDeselected";

type Name = {
  name: string;
  tab: boolean;
  onClick: () => void;
};

const SessionTabMolecule: React.FC<Name> = (props) => {
  return (
    <>
      <div
        className="p-7 lg:pr-10 flex flex-col lg:flex-row items-center py-2 lg:py-4 hover:scale-105 transform active:scale-90 transition cursor-pointer button"
        onClick={props.onClick}
        onTouchEnd={props.onClick}
      >
        {props.tab ? (
          <>
            <SessionSelected />
            <p className="text-center text-xs lg:text-base font-bold lg:pl-2">
              {props.name}
            </p>
          </>
        ) : (
          <>
            <SessionDeselected />
            <p className="text-center text-xs lg:text-base text-gray-500 lg:pl-2">
              {props.name}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default SessionTabMolecule;
