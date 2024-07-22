import React from "react";
import ImageSizeComponent from "../atoms/ImageSize/ImageSizeComponent";

type Image = {
  src: string;
  alt: string;
};

const ThreeToTwoImageMolecule: React.FC<Image> = (props) => {
  return (
    <div className="w-full aspect-w-3 aspect-h-2">
      <ImageSizeComponent src={props.src} alt={props.alt} />
    </div>
  );
};

export default ThreeToTwoImageMolecule;
