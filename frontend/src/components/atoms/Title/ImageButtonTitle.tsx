import React from "react";

type Text = {
  text: string;
};

const ImageButtonTitle: React.FC<Text> = ({ text }) => {
  return <p className="text-center text-sm font-normal">{text}</p>;
};

export default ImageButtonTitle;
