import React from "react";
import { ReactComponent as MoreVerticalIcon } from "../../../assets/icons/more_vertical.svg";

type Props = {
  onDropdownClick: () => void;
};

const MoreVerticalButton: React.FC<Props> = ({ onDropdownClick }) => {
  return <MoreVerticalIcon onClick={onDropdownClick} />;
};

export default MoreVerticalButton;
