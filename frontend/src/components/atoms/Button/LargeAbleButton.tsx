import React from "react";
import SpinnerComponent from "../SpinnerComponent";
import RemainingTimer from "../RemainingTimer";

type Text = {
  onClick?: () => void;
  text: string;
  isLoading?: boolean;
  startAt?: string;
};

const LargeAbleButton: React.FC<Text> = ({
  onClick,
  text,
  isLoading,
  startAt,
}) => {
  return (
    <button
      className="w-full bg-[#2B2F40] py-4 px-8 text-center rounded-lg text-white font-bold flex items-center justify-center"
      onClick={onClick}
      disabled={isLoading}
    >
      <div>
        {isLoading ? <SpinnerComponent /> : text}
        {!isLoading && startAt && <RemainingTimer startAt={startAt} />}
      </div>
    </button>
  );
};

export default LargeAbleButton;
