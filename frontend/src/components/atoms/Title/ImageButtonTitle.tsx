import React from "react";

type Text = {
  text: string;
};

const ImageButtonTitle: React.FC<Text> = ({ text }) => {
  const truncatedText = text.length > 5 ? `${text.slice(0, 5)}...` : text;
  return (
    <span className="text-center text-sm font-normal">{truncatedText}</span>
  );
};

export default ImageButtonTitle;
