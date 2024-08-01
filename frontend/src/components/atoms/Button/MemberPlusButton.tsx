import React from "react";
import { ReactComponent as MemberPlusIcon } from "../../../assets/icons/member-plus.svg";
import { useNavigate } from "react-router";

const MemberPlusButton: React.FC = () => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate(``);
  };
  return (
    <button onClick={handleNav}>
      <MemberPlusIcon />
    </button>
  );
};

export default MemberPlusButton;
