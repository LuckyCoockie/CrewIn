import React from "react";
import { ReactComponent as BackArrow } from "../../../assets/icons/backarrow.svg";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      <button onClick={handleBack} >
        <BackArrow />
      </button>
    </>
  );
};

export default BackButton;
