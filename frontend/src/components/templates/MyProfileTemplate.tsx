import React, { useState } from "react";
import { useQuery } from "react-query";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import MyPageRecordInfoOrganism from "../organisms/MyPage/MyPageRecordInfoOrganism";
import MyPageHeaderOrganism from "../organisms/MyPage/MyPageHeaderOrganism";
import MyPageMadeSessionOrganism from "../organisms/MyPage/MyPageMadeSessionOrganism";
import MyPageParticipatedSessionOrganism from "../organisms/MyPage/MyPageParticipatedSessionOrganism";
import MyPageMapOrganism from "../organisms/MyPage/MyPageMapOrganism";
import MyPageAlbumOrganism from "../organisms/MyPage/MyPageAlbumOrganism";
import {
  getMyProfileInfo,
  ProfileDto,
  getMyMaps,
  MyMapsDto,
  getMyMadeSessions,
  getMyParticipatedSessions,
  MyMadeSessionDto,
  MyParticipatedSessionDto,
} from "../../apis/api/mypage";

const MyProfileTemplate: React.FC = () => {
  console.log("여기는 내페이지");
  const [currentTab, setCurrentTab] = useState<string>("러닝 정보");
  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const texts = ["러닝 정보", "사진첩"];
  const numericMemberId = null;

  // React Query를 사용하여 데이터를 한 번에 가져옴
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery<ProfileDto>(["myProfile", numericMemberId], () =>
    getMyProfileInfo()
  );

  const {
    data: mapsData,
    isLoading: isMapsLoading,
    isError: isMapsError,
  } = useQuery<MyMapsDto[]>("myMaps", getMyMaps);

  const {
    data: madeSessions,
    isLoading: isMadeSessionsLoading,
    isError: isMadeSessionsError,
  } = useQuery<MyMadeSessionDto[]>(["myMadeSessions", 0], () =>
    getMyMadeSessions(0).then((res) => res.items)
  );

  const {
    data: participatedSessions,
    isLoading: isParticipatedSessionsLoading,
    isError: isParticipatedSessionsError,
  } = useQuery<MyParticipatedSessionDto[]>(["myParticipatedSessions", 0], () =>
    getMyParticipatedSessions(0).then((res) => res.items)
  );

  // 로딩 상태 처리
  if (
    isProfileLoading ||
    isMapsLoading ||
    isMadeSessionsLoading ||
    isParticipatedSessionsLoading
  ) {
    return <div>Loading...</div>;
  }

  // 에러 상태 처리
  if (
    isProfileError ||
    isMapsError ||
    isMadeSessionsError ||
    isParticipatedSessionsError
  ) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <header>
        <MyPageHeaderOrganism />
      </header>
      <MyPageRecordInfoOrganism profileData={profileData!} />
      <NavTabMolecule
        texts={texts}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
      {currentTab === "러닝 정보" ? (
        <>
          <div className="my-4">
            <MyPageMadeSessionOrganism sessions={madeSessions!} />
          </div>
          <div className="my-4">
            <MyPageParticipatedSessionOrganism
              sessions={participatedSessions!}
            />
          </div>
          <div className="my-4">
            <MyPageMapOrganism mapsData={mapsData!} />
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
