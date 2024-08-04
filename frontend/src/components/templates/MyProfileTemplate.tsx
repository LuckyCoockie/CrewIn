import React, { useState } from "react";
import { useQuery } from "react-query";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import MyPageRecordInfoOrganism from "../organisms/mypage/MyPageRecordInfoOrganism";
import MyPageHeaderOrganism from "../organisms/mypage/MyPageHeaderOrganism";
import MyPageMadeSessionOrganism from "../organisms/mypage/MyPageMadeSessionOrganism";
import MyPageParticipatedSessionOrganism from "../organisms/mypage/MyPageParticipatedSessionOrganism";
import MyPageMapOrganism from "../organisms/mypage/MyPageMapOrganism";
import MyPageAlbumOrganism from "../organisms/mypage/MyPageAlbumOrganism";
import {
  getMyProfileInfo,
  MyProfileDto,
  getMyMaps,
  MyMapsDto,
} from "../../apis/api/mypage";

const MyProfileTemplate: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("러닝 정보");
  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const texts = ["러닝 정보", "사진첩"];

  // React Query를 사용하여 데이터를 가져옴
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery<MyProfileDto>("myProfile", getMyProfileInfo);

  const {
    data: mapsData,
    isLoading: isMapsLoading,
    isError: isMapsError,
  } = useQuery<MyMapsDto[]>("myMaps", getMyMaps);

  // 로딩 상태 처리
  if (isProfileLoading || isMapsLoading) {
    return <div>Loading...</div>;
  }

  // 에러 상태 처리
  if (isProfileError || isMapsError) {
    return <div>Error loading data</div>;
  }

  // 데이터가 존재하지 않을 경우의 처리
  if (!profileData || !mapsData) {
    return <div>No data available</div>;
  }

  return (
    <>
      <header>
        <MyPageHeaderOrganism />
      </header>
      <MyPageRecordInfoOrganism profileData={profileData} />
      <NavTabMolecule
        texts={texts}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
      {currentTab === "러닝 정보" ? (
        <>
          <div className="my-4">
            <MyPageMadeSessionOrganism />
          </div>
          <div className="my-4">
            <MyPageParticipatedSessionOrganism />
          </div>
          <div className="my-4">
            <MyPageMapOrganism mapsData={mapsData} />
          </div>
        </>
      ) : (
        <div className="my-4">
          <MyPageAlbumOrganism />
        </div>
      )}
    </>
  );
};

export default MyProfileTemplate;
