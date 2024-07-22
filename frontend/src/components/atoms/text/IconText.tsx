import React from "react";

type OwnProps = {
  icon: string;
  text: string;
};

export const IconTextComponent: React.FC<OwnProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center">
      <img src={icon} className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mb-1" />
      <p className="text-gray-700 text-xs md:text-md truncate">{text}</p>
    </div>
  );
};
