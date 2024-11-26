// components/ToggleButton.tsx

import React from "react";

interface ToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onToggle, className }) => {
  return (
    <div
      className={`relative rounded-full w-12 h-6 transition-colors duration-200 ease-in-out ${isActive ? "bg-[#2b2f40e6]" : "bg-disable]"} ${className}`}
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <div
        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${isActive ? "translate-x-6 bg-white" : "bg-reverse"}`}
      />
    </div>
  );
};

export default ToggleButton;
