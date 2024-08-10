import React from "react";
import { ReactComponent as MemberPlusIcon } from "../../../assets/icons/member-plus.svg";
import { useParams, useNavigate } from "react-router";

const MemberPlusButton: React.FC = () => {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate();
  const handleNav = () => {
    navigate(`/crew/${crewId}/invite`);
  };
  return (
    <button onClick={handleNav}>
      <MemberPlusIcon />
    </button>
  );
};

export default MemberPlusButton;
