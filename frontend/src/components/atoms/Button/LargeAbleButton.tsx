import React from "react";
import SpinnerComponent from "../SpinnerComponent";

type Text = {
  onClick?: () => void;
  text: string;
  isLoading?: boolean;
};

const LargeAbleButton: React.FC<Text> = ({ onClick, text, isLoading }) => {
  return (
    <button
      className="w-full bg-[#2B2F40] py-4 px-8 text-center rounded-lg text-white font-bold flex items-center justify-center"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <SpinnerComponent /> : text}
    </button>
  );
};

export default LargeAbleButton;
