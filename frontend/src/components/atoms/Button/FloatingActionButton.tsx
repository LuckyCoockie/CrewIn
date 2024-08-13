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
    <div className="z-50 fixed bottom-24 md:bottom-8 left-0 pr-4 right-8 flex justify-end max-w-[500px] w-full mx-auto disabled">
      <button
        className={`w-[56px] h-[56px] bg-white text-white font-bold py-4 px-4 rounded-full shadow-lg focus:outline-none hover:ring-1 hover:ring-primary-500 ${className}`}
        onClick={onClick}
        style={{ pointerEvents: "auto" }}
      >
        {children}
      </button>
    </div>
  );
};

export default FloatingActionButton;
