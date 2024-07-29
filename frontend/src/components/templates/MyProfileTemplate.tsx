import React, { useState } from "react";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import MyPageRecordInfoOrganism from "../organisms/MyPage/MyPageRecordInfoOrganism";
import MyPageHeaderOrganism from "../organisms/MyPage/MyPageHeaderOrganism";
import MyPageMadeSessionOrganism from "../organisms/MyPage/MyPageMadeSessionOrganism";
import MyPageParticipatedSessionOrganism from "../organisms/MyPage/MyPageParticipatedSessionOrganism";
import MyPageMapOrganism from "../organisms/MyPage/MyPageMapOrganism";
import MyPageAlbumOrganism from "../organisms/MyPage/MyPageAlbumOrganism";

const MyProfileTemplate: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("러닝 정보");
  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const texts = ["러닝 정보", "사진첩"];
  return (
    <>
      <header>
        <MyPageHeaderOrganism />
      </header>
      <MyPageRecordInfoOrganism />
      <NavTabMolecule
        texts={texts}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
      {currentTab === "러닝 정보" ? (
        <>
          <div className="my-2">
            <MyPageMadeSessionOrganism />
          </div>
          <div className="my-2">
            <MyPageParticipatedSessionOrganism />
          </div>
          <div className="my-2">
            <MyPageMapOrganism />
          </div>
        </>
      ) : (
        <div className="my-2">
          <MyPageAlbumOrganism />
        </div>
      )}
    </>
  );
};

export default MyProfileTemplate;
