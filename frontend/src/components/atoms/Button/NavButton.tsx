import React from "react";

type Title = {
  text: string;
  devide: number;
};

const NavButton: React.FC<Title> = ({ text, devide }) => {
  return (
    <button className={`bg-gray-100 font-bold text-sm py-2 w-1/${devide}`}>
      {text}
    </button>
  );
};

export default NavButton;
