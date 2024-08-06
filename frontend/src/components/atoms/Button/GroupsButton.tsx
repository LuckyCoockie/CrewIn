import React from "react";
import { ReactComponent as GroupsIcon } from "../../../assets/icons/groups.svg";
import { useNavigate } from "react-router";

type PositionProps = {
  userPosition: string;
};

const GroupsButton: React.FC<PositionProps> = ({ userPosition }) => {
  const navigate = useNavigate();
  const handleNav = () => {
    if (userPosition === "CAPTAIN") {
      navigate(`/crew/member/captain`);
    } else {
      navigate(`/crew/member`);
    }
  };
  return (
    <button onClick={handleNav}>
      <GroupsIcon />
    </button>
  );
};

export default GroupsButton;
