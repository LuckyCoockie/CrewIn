import React from "react";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import SettingIcon from "../../atoms/Icons/SettingIcon";
import LogoutButton from "../../atoms/Button/LogoutButton";
import { useNavigate } from "react-router";

const MyPageHeaderOrganism: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("로그아웃");
    // 로그아웃 API 요청
  };
  const handleSetting = () => {
    console.log("유저 정보 수정");
    // 유저 정보 수정 페이지로 이동
    navigate(`/info`);
  };
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <LargeTitleMolecule text="마이페이지" />
        </div>
        <div className="flex justify-end">
          <LogoutButton logout={handleLogout} />
          <SettingIcon setting={handleSetting} />
        </div>
      </div>
    </>
  );
};

export default MyPageHeaderOrganism;
