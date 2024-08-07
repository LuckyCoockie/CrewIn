import React from "react";
import { ReactComponent as MemberPlusIcon } from "../../../assets/icons/member-plus.svg";
import { useNavigate } from "react-router";

type MemberPlusButtonProps = {
  idData: number;
};

const MemberPlusButton: React.FC<MemberPlusButtonProps> = ({
  idData,
}) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate(`/crew/${idData}/invite`);
  };
  return (
    <button onClick={handleNav}>
      <MemberPlusIcon />
    </button>
  );
};

export default MemberPlusButton;
