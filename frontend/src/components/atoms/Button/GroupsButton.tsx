import React from "react";
import { ReactComponent as GroupsIcon } from "../../../assets/icons/groups.svg";
import { useParams, useNavigate } from "react-router";

type PositionProps = {
  userPosition: string;
};

const GroupsButton: React.FC<PositionProps> = ({ userPosition }) => {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();

  const handleNav = () => {
    if (userPosition === "CAPTAIN") {
      navigate(`/crew/detail/${crewId}/member/captain`);
    } else {
      navigate(`/crew/detail/${crewId}/member`);
    }
  };
  return (
    <button onClick={handleNav}>
      <GroupsIcon />
    </button>
  );
};

export default GroupsButton;
