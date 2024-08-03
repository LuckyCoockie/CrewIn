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
      <div className="flex flex-col items-center py-2 hover:shadow-lg hover:scale-105 transform active:shadow-inner active:scale-95 transition duration-150 cursor-pointer" onClick={props.onClick}>
        {props.tab ? (
          <>
            <SessionSelected />
            <p className="text-center text-xs font-bold">{props.name}</p>
          </>
        ) : (
          <>
            <SessionDeselected />
            <p className="text-center text-xs text-gray-500">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default SessionTabMolecule;
