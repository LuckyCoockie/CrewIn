import React from "react";
import RemainingTimer from "../RemainingTimer";

type Text = {
  text: string;
  startAt?: string;
};

const LargeDisableButton: React.FC<Text> = ({ text, startAt }) => {
  return (
    <button
      disabled
      className="w-full bg-[#2b2f401a] py-4 px-8 text-center rounded-lg text-white font-bold"
    >
      <div>
        {text}
        {startAt && <RemainingTimer startAt={startAt} />}
      </div>
    </button>
  );
};

export default LargeDisableButton;
