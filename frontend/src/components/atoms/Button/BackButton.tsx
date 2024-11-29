import React from "react";
import { ReactComponent as BackArrow } from "../../../assets/icons/backarrow.svg";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (navigate.length === 1) navigate("/");
    else navigate(-1);
  };
  return (
    <>
      <button onClick={handleBack}>
        <BackArrow className="fill-primary" />
      </button>
    </>
  );
};

export default BackButton;
