import React from "react";
import SpinnerComponent from "./SpinnerComponent";

const SpinnerFullComponent: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-300 bg-opacity-60 flex justify-center items-center z-50">
      <SpinnerComponent />
    </div>
  );
};

export default SpinnerFullComponent;
