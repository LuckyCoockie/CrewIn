import React from "react";

type OwnProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactElement;
};

const FloatingActionButton: React.FC<OwnProps> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <button
      className={`
        fab
        fixed bottom-20 right-4 md:bottom-10 md:right-10
        w-14 h-14 bg-white rounded-full shadow-xl
        ring-1 ring-gray-100 hover:ring-primary-500
        focus:outline-none transition duration-300 ease-in-out
        flex items-center justify-center
        ${className}
      `}
      onClick={onClick}
      style={{ pointerEvents: "auto" }}
    >
      {children}
    </button>
  );
};

export default FloatingActionButton;
