import React from "react";
import BarTitle from "../atoms/Title/BarTitle";
import BarContent from "../atoms/Content/BarContent";
import ProfileImageComponent from "../atoms/ImageSize/ProfileImageComponent";

interface ProfileHeaderProps {
  profileImage: string;
  username: string;
  timeAgo: string;
}

const UserProfileBarNoMenu: React.FC<ProfileHeaderProps> = ({
  profileImage,
  username,
  timeAgo,
}) => {
  return (
    <div className="flex items-center w-full mb-4">
      <ProfileImageComponent src={profileImage} />
      <div className="flex flex-col">
        <BarTitle title={username} />
        <BarContent content={timeAgo} />
      </div>
    </div>
  );
};

export default UserProfileBarNoMenu;
