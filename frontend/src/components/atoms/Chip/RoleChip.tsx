import React from "react";

type Text = {
  text: string;
};
const RoleChip: React.FC<Text> = ({ text }) => {
  return (
    <div className="rounded-2xl bg-black py-2 text-xs font-bold leading-none text-white w-16">
      <div className="mt-px text-center">{text}</div>
    </div>
  );
};

export default RoleChip;
