import React from "react";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import SettingIcon from "../../atoms/Icons/SettingIcon";

const MyPageHeaderOrganism: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <LargeTitleMolecule text="마이페이지" />
        </div>
        <div className="flex justify-end">
          <SettingIcon />
        </div>
      </div>
    </>
  );
};

export default MyPageHeaderOrganism;
