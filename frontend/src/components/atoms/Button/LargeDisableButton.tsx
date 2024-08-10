import React from "react";

type Text = {
  text: string;
};

const LargeDisableButton: React.FC<Text> = (props) => {
  return (
    <button
      disabled
      className="w-full bg-[#2b2f401a] py-4 px-8 text-center rounded-lg text-white font-bold"
    >
      {props.text}
    </button>
  );
};

export default LargeDisableButton;
