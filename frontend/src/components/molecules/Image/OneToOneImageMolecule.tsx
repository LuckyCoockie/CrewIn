import React from "react";
import ImageSizeComponent from "../../atoms/ImageSize/ImageSizeComponent";

type Image = {
  src: string;
  alt: string;
};

const OneToOneImageMolecule: React.FC<Image> = (props) => {
  return (
    <div className="w-full aspect-w-1 aspect-h-1">
      <ImageSizeComponent src={props.src} alt={props.alt} />
    </div>
  );
};

export default OneToOneImageMolecule;
