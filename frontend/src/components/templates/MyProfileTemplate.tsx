import React, { useState } from "react";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import MyPageHeaderOrganism from "../organisms/MyPage/MyPageHeaderOrganism";
import MyPageMadeSessionOrganism from "../organisms/MyPage/MyPageMadeSessionOrganism";
import MyPageParticipatedSessionOrganism from "../organisms/MyPage/MyPageParticipatedSessionOrganism";
import MyPageMapOrganism from "../organisms/MyPage/MyPageMapOrganism";

const MyProfileTemplate: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("러닝 정보");
  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const texts = ["러닝 정보", "사진첩"];
  return (
    <>
      <MyPageHeaderOrganism />
      <NavTabMolecule
        texts={texts}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
      <div className="my-6">
        <MyPageMadeSessionOrganism />
      </div>
      <div className="my-6">
        <MyPageParticipatedSessionOrganism />
      </div>
      <div className="my-6">
        <MyPageMapOrganism />
      </div>
    </>
  );
};

export default MyProfileTemplate;
