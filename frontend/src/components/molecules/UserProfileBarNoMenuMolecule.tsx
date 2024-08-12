import React from "react";
import BarTitle from "../atoms/Title/BarTitle";
import BarContent from "../atoms/Content/BarContent";
import ProfileImageComponent from "../atoms/ImageSize/ProfileImageComponent";
import checkMark from "../../assets/images/checkmark.png";

interface ProfileHeaderProps {
  profileImage: string;
  username: string;
  timeAgo: string;
  onClick?: () => void;
}

const UserProfileBarNoMenu: React.FC<ProfileHeaderProps> = ({
  profileImage,
  username,
  timeAgo,
  onClick,
}) => {
  return (
    <div className="flex items-center w-full mb-2">
      <div className="cursor-pointer" onClick={onClick}>
        <ProfileImageComponent src={profileImage} />
      </div>
      <div className="flex flex-col flex-grow" onClick={onClick}>
        <div className="flex items-center">
          <BarTitle title={username} />
          <button className="flex flex-col ml-2 w-4 h-4">
            <img src={checkMark} alt="checkMark" />
          </button>
        </div>
        <BarContent content={timeAgo} />
      </div>
    </div>
  );
};

export default UserProfileBarNoMenu;
