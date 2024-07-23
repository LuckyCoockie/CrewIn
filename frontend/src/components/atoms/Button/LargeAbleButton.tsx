import React from "react";

type Text = {
  text: string;
};

const LargeAbleButton: React.FC<Text> = (props) => {
  return (
    <button className="w-full bg-[#2B2F40] py-4 px-8 text-center rounded-lg disable text-white font-bold">
      {props.text}
    </button>
  );
};

export default LargeAbleButton;
