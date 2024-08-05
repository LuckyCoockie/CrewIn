import React from "react";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";

type Props = {
  logout: () => void;
};

const LogoutButton: React.FC<Props> = ({ logout }) => {
  return <LogoutIcon onClick={logout} className="cursor-pointer" />;
};

export default LogoutButton;
