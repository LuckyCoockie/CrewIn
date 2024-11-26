import React from "react";
import UserSelected from "../../atoms/Bottombar/UserSelected";
import UserDeselected from "../../atoms/Bottombar/UserDeselected";

type Name = {
  name: string;
  tab: boolean;
  onClick: () => void;
};

const ProfileTabMolecule: React.FC<Name> = (props) => {
  return (
    <>
      <div
        className="p-7 lg:pr-10 flex flex-col lg:flex-row items-center py-2 lg:py-4 hover:scale-105 transform active:scale-90 transition cursor-pointer button"
        onClick={props.onClick}
        onTouchEnd={props.onClick}
      >
        {props.tab ? (
          <>
            <UserSelected />
            <p className="text-center text-xs lg:text-base font-bold lg:pl-2">{props.name}</p>
          </>
        ) : (
          <>
            <UserDeselected />
            <p className="text-center text-xs lg:text-base text-reverse lg:pl-2">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileTabMolecule;
