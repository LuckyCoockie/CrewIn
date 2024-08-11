import React from "react";

type Text = {
  onClick?: () => void;
  text: string;
  isLoading?: boolean;
};

const LargeAbleButton: React.FC<Text> = (props) => {
  return (
    <button
      className="w-full bg-[#2B2F40] py-4 px-8 text-center rounded-lg text-white font-bold"
      onClick={props.onClick}
      disabled={props.isLoading}
    >
      {props.text}
    </button>
  );
};

export default LargeAbleButton;
