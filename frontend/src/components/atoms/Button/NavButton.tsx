import React from "react";

type Title = {
  text: string;
  devide: number;
  onClick: () => void;
};

const NavButton: React.FC<Title> = ({ text, devide, onClick }) => {
  return (
    <button
      className={`border-b font-bold text-sm py-2 w-1/${devide}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NavButton;
