import React from "react";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import SettingIcon from "../../atoms/Icons/SettingIcon";
import LogoutButton from "../../atoms/Button/LogoutButton";
import { logout } from "../../../apis/api/logout";
import { useNavigate } from "react-router-dom";
import store from "../../../modules";
import { loading } from "../../../modules/reducers/auth";
import { clearAuth } from "../../../util/auth";

const MyPageHeaderOrganism: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      store.dispatch(loading());
      logout().then(() => clearAuth());
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleSetting = () => {
    console.log("유저 정보 수정");
    navigate(`/info`);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <LargeTitleMolecule text="마이페이지" />
      </div>
      <div className="flex justify-end">
        <LogoutButton logout={handleLogout} />
        <SettingIcon setting={handleSetting} />
      </div>
    </div>
  );
};

export default MyPageHeaderOrganism;
