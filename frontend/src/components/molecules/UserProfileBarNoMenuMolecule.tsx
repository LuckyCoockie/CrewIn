import React from "react";
import BarTitle from "../atoms/Title/BarTitle";
import BarContent from "../atoms/Content/BarContent";
import ProfileImageComponent from "../atoms/ImageSize/ProfileImageComponent";

interface ProfileHeaderProps {
  profileImage: string;
  username: string;
  timeAgo: string;
  onClick: () => void;
}

const UserProfileBarNoMenu: React.FC<ProfileHeaderProps> = ({
  profileImage,
  username,
  timeAgo,
  onClick,
}) => {
  return (
    <div className="flex items-center w-full mb-4">
      <div className="cursor-pointer" onClick={onClick}>
        <ProfileImageComponent src={profileImage} />
      </div>
      <div className="flex flex-col" onClick={onClick}>
        <BarTitle title={username} />
        <BarContent content={timeAgo} />
      </div>
    </div>
  );
};

export default UserProfileBarNoMenu;
