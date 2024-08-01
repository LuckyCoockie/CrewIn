import React from "react";
import { ReactComponent as GroupsIcon } from "../../../assets/icons/groups.svg";
import { useNavigate } from "react-router";

const GroupsButton: React.FC = () => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate(`/crew/membersearch`);
  };
  return (
    <button onClick={handleNav}>
      <GroupsIcon />
    </button>
  );
};

export default GroupsButton;
