import React from "react";
import cameraButton from "../../../assets/images/camerabutton.png";

type Image = {
  src?: string;
  onClick?: () => void;
  editable?: boolean;
};

const MyPageProfileImageComponent: React.FC<Image> = ({
  src,
  onClick,
  editable = true,
}) => {
  return (
    <div className="flex relative w-40 h-40" onClick={onClick}>
      <img
        src={src}
        alt="Preview"
        className="mx-auto border-2 rounded-full object-cover square bg-white"
      />
      {editable && (
        <div className="absolute bottom-2 right-2">
          <img src={cameraButton} alt="check Button" className="w-8 h-8" />
        </div>
      )}
    </div>
  );
};

export default MyPageProfileImageComponent;
