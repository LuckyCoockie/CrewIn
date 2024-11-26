import React from "react";

type Image = {
  src: string;
};

const ProfileImageComponent: React.FC<Image> = ({ src }) => {
  return (
    <div className="square w-10 h-10 mx-1 mr-3">
      <img src={src} alt="profile" className="border rounded-full" />
    </div>
  );
};

export default ProfileImageComponent;
