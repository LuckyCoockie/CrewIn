import React from "react";
import { ReactComponent as HomeSelected } from "../../../assets/icons/home_selected.svg";

const BottomBar: React.FC = () => {
  return (
    <div>
      <HomeSelected className="fill-letter" />
    </div>
  );
};

export default BottomBar;
