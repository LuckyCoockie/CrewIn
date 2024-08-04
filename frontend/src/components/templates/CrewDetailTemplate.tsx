import React, { useState } from "react";
import { useQuery } from "react-query";
import CrewInfoOrganism from "../organisms/CrewInfoOrganism";
import CrewNoticeOrganism from "../organisms/CrewNoticeOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import ThreeToTwoImageMolecule from "../molecules/Image/ThreeToTwoImageMolecule";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewAlbumOrganism from "../organisms/CrewAlbumOrganism";
import CrewHeaderBarOrganism from "../organisms/CrewHeaderBarOrganism";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";

import GroupsButton from "../atoms/Button/GroupsButton";
import MemberPlusButton from "../atoms/Button/MemberPlusButton";
import {
  getCrewInfo,
  getCrewNoticeList,
  getCrewGalleryList,
} from "../../apis/api/crewdetail";
import { getMyCrews } from "../../apis/api/mycrew";
import { useParams } from "react-router";

const CrewDetailTemplate: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("정보");
  const { crewId } = useParams<{ crewId: string }>();
  const numericCrewId = Number(crewId);

  const pageNo = 0;

  // 크루 정보를 가져오는 React Query 훅
  const {
    data: infoData,
    isLoading: infoLoading,
    error: infoError,
  } = useQuery(["crewInfo", { crewId }], () =>
    getCrewInfo({ crewId: numericCrewId })
  );

  // 내 크루 목록을 가져오는 React Query 훅
  const {
    data: myCrewsData,
    isLoading: myCrewsLoading,
    error: myCrewsError,
  } = useQuery("myCrews", getMyCrews);

  const userCrew = myCrewsData?.crews.find(
    (crew) => crew.crewId === numericCrewId
  );

  const isUserCrewMember = !!userCrew;
  const userPosition = userCrew?.position;

  console.log("isUserCrewMember:", isUserCrewMember);
  console.log("userPosition:", userPosition);

  // 공지사항과 사진첩을 가져오는 React Query 훅
  const {
    data: noticeData,
    isLoading: noticeLoading,
    error: noticeError,
  } = useQuery(
    ["crewNotice", { crewId, pageNo }],
    () =>
      getCrewNoticeList({ crewId: numericCrewId, pageNo }).then(
        (data) => data.crewNoticeList
      ),
    {
      enabled: isUserCrewMember, // isUserCrewMember가 true일 때만 호출
    }
  );

  const {
    data: galleryData,
    isLoading: galleryLoading,
    error: galleryError,
  } = useQuery(
    ["crewGallery", { crewId, pageNo }],
    () =>
      getCrewGalleryList({ crewId: numericCrewId, pageNo }).then(
        (data) => data.crewGalleryList
      ),
    {
      enabled: isUserCrewMember, // isUserCrewMember가 true일 때만 호출
    }
  );

  const handleTabClick = (tab: string) => {
    console.log("Tab clicked:", tab);
    setCurrentTab(tab);
  };

  const renderTab = () => {
    if (infoLoading || noticeLoading || galleryLoading || myCrewsLoading) {
      return <div>Loading...</div>;
    }

    if (infoError || noticeError || galleryError || myCrewsError) {
      return <div>Error loading data</div>;
    }

    if (!isUserCrewMember) {
      return (
        <CrewInfoOrganism
          crewname={infoData!.crewName}
          captain={infoData!.captainName}
          slogan={infoData!.slogan}
          area={infoData!.area}
          birth={infoData!.crewBirth}
          people={infoData!.crewCount}
          introduction={infoData!.introduction}
        />
      );
    }

    switch (currentTab) {
      case "공지사항":
        return noticeData ? (
          <CrewNoticeOrganism notices={noticeData} />
        ) : (
          <div>No Notice Data</div>
        );
      case "정보":
        return infoData ? (
          <CrewInfoOrganism
            crewname={infoData.crewName}
            captain={infoData.captainName}
            slogan={infoData.slogan}
            area={infoData.area}
            birth={infoData.crewBirth}
            people={infoData.crewCount}
            introduction={infoData.introduction}
          />
        ) : (
          <div>No Info Data</div>
        );
      case "사진첩":
        return galleryData ? (
          <CrewAlbumOrganism
            photos={galleryData.flatMap((gallery) => gallery.imageUrls)}
          />
        ) : (
          <div>No Gallery Data</div>
        );
      default:
        return infoData ? (
          <CrewInfoOrganism
            crewname={infoData.crewName}
            captain={infoData.captainName}
            slogan={infoData.slogan}
            area={infoData.area}
            birth={infoData.crewBirth}
            people={infoData.crewCount}
            introduction={infoData.introduction}
          />
        ) : (
          <div>No Info Data</div>
        );
    }
  };

  const texts = ["정보", "공지사항", "사진첩"];

  return (
    <>
      {!myCrewsLoading && !myCrewsError && myCrewsData && (
        <CrewHeaderBarOrganism crewList={myCrewsData.crews} />
      )}
      <header>
        <BackHeaderMediumOrganism
          text={infoData ? infoData.crewName : "Loading..."}
        />
        <div className="flex ms-auto">
          <GroupsButton />
          <MemberPlusButton />
          <EditDeleteDropdownOrganism type="CREW" idData={infoData?.crewId} />
        </div>
      </header>
      <ThreeToTwoImageMolecule
        src={infoData ? infoData.imageUrl : ""}
        alt="crewbanner"
      />
      <div>
        {isUserCrewMember && (
          <NavTabMolecule
            texts={texts}
            onTabClick={handleTabClick}
            currentTab={currentTab}
          />
        )}
        {renderTab()}
      </div>
    </>
  );
};

export default CrewDetailTemplate;
