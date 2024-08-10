import React from "react";

type Text = {
  onClick?: () => void;
  text: string;
};

const LargeAbleButton: React.FC<Text> = (props) => {
  return (
    <button
      className="w-full bg-[#2B2F40] py-4 px-8 text-center rounded-lg text-white font-bold"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default LargeAbleButton;
