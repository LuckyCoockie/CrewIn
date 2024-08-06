import React from "react";

type Title = {
  text: string;
  devide: number;
  onClick: () => void;
  isActive: boolean;
};

const NavButton: React.FC<Title> = ({ text, devide, onClick, isActive }) => {
  return (
    <button
      className={`font-bold text-sm py-3 transition duration-300 ease-in-out ${
        isActive ? "border-b-2 border-black" : "text-gray-300 border-b"
      }`}
      style={{ width: `${100 / devide}%` }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NavButton;
