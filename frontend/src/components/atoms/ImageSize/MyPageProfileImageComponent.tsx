import React from "react";

type Image = {
  src: string;
};

const MyPageProfileImageComponent: React.FC<Image> = ({ src }) => {
  return (
    <img
      src={src}
      alt="profile"
      className="border w-20 h-20 rounded-full mx-3 mr-3"
    />
  );
};

export default MyPageProfileImageComponent;
