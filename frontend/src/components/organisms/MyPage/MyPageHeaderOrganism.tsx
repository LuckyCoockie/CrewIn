import React from "react";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import SettingIcon from "../../atoms/Icons/SettingIcon";
import LogoutButton from "../../atoms/Button/LogoutButton";
import { logout } from "../../../apis/api/logout";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../../util/auth";

const MyPageHeaderOrganism: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    logout().then(() => clearAuth());
  };

  const handleSetting = () => {
    navigate(`/info`);
  };

  return (
    <div className="flex items-center justify-between w-full h-10">
      <div className="flex items-center">
        <LargeTitleMolecule text="마이페이지" />
      </div>
      <div className="flex justify-end">
        <LogoutButton logout={handleLogout} />
        <div className="ms-1.5">
          <SettingIcon setting={handleSetting} />
        </div>
      </div>
    </div>
  );
};

export default MyPageHeaderOrganism;
