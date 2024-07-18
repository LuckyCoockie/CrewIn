import React from "react";

type Text = {
  text: string;
};

const LargeDisableButton: React.FC<Text> = (props) => {
  return (
    <button className="w-full bg-[#2b2f40e6] py-4 px-8 text-center rounded-lg disable text-white font-bold">
      {props.text}
    </button>
  );
};

export default LargeDisableButton;
