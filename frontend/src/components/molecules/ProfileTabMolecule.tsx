import React from "react";
import UserSelected from "../atoms/Bottombar/UserSelected";
import UserDeselected from "../atoms/Bottombar/UserDeselected";

type Name = {
  name: string;
  tab: boolean;
  onClick: () => void;
};

const ProfileTabMolecule: React.FC<Name> = (props) => {
  return (
    <>
      <div className="flex flex-col items-center py-2" onClick={props.onClick}>
        {props.tab ? (
          <>
            <UserSelected />
            <p className="text-center text-xs font-bold">{props.name}</p>
          </>
        ) : (
          <>
            <UserDeselected />
            <p className="text-center text-xs text-gray-500">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileTabMolecule;
