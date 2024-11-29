import React from "react";
import { ReactComponent as SettingIcon } from "../../../assets/icons/setting.svg";

type Props = {
  setting: () => void;
};

const Icon: React.FC<Props> = ({ setting }) => {
  return <SettingIcon onClick={setting} className="fill-primary" />;
};

export default Icon;
