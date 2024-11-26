import React from "react";

type OwnProps = {
  icon: string;
  text: string;
};

export const IconTextComponent: React.FC<OwnProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center">
      <img src={icon} className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 xs:mb-1" />
      <p className="text-gray-700 text-xs xs:text-sm truncate">{text}</p>
    </div>
  );
};
