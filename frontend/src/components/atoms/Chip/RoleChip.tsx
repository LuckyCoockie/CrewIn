import React from "react";

type Text = {
  text: string;
};
const RoleChip: React.FC<Text> = ({ text }) => {
  return (
    <div className="rounded-2xl bg-black w-full items-start px-1 py-2 text-xs font-bold leading-none text-white">
      <div className="mt-px text-center">{text}</div>
    </div>
  );
};

export default RoleChip;
