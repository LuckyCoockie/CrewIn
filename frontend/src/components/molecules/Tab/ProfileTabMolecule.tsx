import React from "react";
import { ReactComponent as UserSelected } from "../../../assets/icons/user_selected.svg";
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
            <UserSelected className="fill-primary"/>
            <p className="text-center text-xs lg:text-base font-bold lg:pl-2">{props.name}</p>
          </>
        ) : (
          <>
            <UserDeselected />
            <p className="text-center text-xs lg:text-base text-sub lg:pl-2">{props.name}</p>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileTabMolecule;
