import React from "react";

type Image = {
  src: string;
  alt: string;
};

const ImageSizeComponent: React.FC<Image> = (props) => {
  return (
    <div >
    <img className="w-full h-full object-cover" src={props.src} alt={props.src} />
  </div>
  );
};

export default ImageSizeComponent;
