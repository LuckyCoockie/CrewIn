import React from "react";

type Image = {
  src: string;
};

const ProfileImageComponent: React.FC<Image> = ({ src }) => {
  return (
    <img
      src={src}
      alt="profile"
      className="border w-10 h-10 rounded-full mx-3 mr-3"
    />
  );
};

export default ProfileImageComponent;
