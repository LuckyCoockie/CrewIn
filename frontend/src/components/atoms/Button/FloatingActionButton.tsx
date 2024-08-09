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
    <div className="fixed bottom-24 left-0 pr-10 right-12 flex justify-end max-w-[550px] w-full mx-auto z-50">
      <button
        className={`w-[56px] h-[56px] bg-white text-white font-bold py-4 px-4 rounded-full shadow-lg focus:outline-none hover:ring-1 hover:ring-primary-500 ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

export default FloatingActionButton;
