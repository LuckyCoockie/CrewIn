import React from "react";

type Text = {
  text: string | JSX.Element;
};

const ImageButtonTitle: React.FC<Text> = ({ text }) => {
  // 텍스트가 문자열일 경우만 자르기 적용
  const truncatedText =
    typeof text === "string" && text.length > 5
      ? `${text.slice(0, 4)}..`
      : text;

  return (
    <span className="text-center text-sm font-normal tracking-tighter">
      {truncatedText}
    </span>
  );
};

export default ImageButtonTitle;
