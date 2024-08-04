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

  const pageNo = 0;

  // 크루 정보를 가져오는 React Query 훅
  const {
    data: infoData,
    isLoading: infoLoading,
    error: infoError,
  } = useQuery(["crewInfo", { crewId }], () =>
    getCrewInfo({ crewId: Number(crewId) })
  );

  // 크루 공지사항을 가져오는 React Query 훅
  const {
    data: noticeData,
    isLoading: noticeLoading,
    error: noticeError,
  } = useQuery(["crewNotice", { crewId, pageNo }], () =>
    getCrewNoticeList({ crewId: Number(crewId), pageNo }).then(
      (data) => data.crewNoticeList
    )
  );

  // 크루 사진첩을 가져오는 React Query 훅
  const {
    data: galleryData,
    isLoading: galleryLoading,
    error: galleryError,
  } = useQuery(["crewGallery", { crewId, pageNo }], () =>
    getCrewGalleryList({ crewId: Number(crewId), pageNo }).then(
      (data) => data.crewGalleryList
    )
  );

  // 내 크루 목록을 가져오는 React Query 훅
  const {
    data: myCrewsData,
    isLoading: myCrewsLoading,
    error: myCrewsError,
  } = useQuery("myCrews", getMyCrews);

  // 로그 출력
  const userCrew = myCrewsData?.crews.find(
    (crew) => crew.crewId === Number(crewId)
  );

  const isUserCrewMember = !!userCrew;
  const userPosition = userCrew?.position;

  console.log("isUserCrewMember:", isUserCrewMember);
  console.log("userPosition:", userPosition);
  
  // 오류 로그 출력
  // if (infoError) console.error("infoError", infoError);
  // if (noticeError) console.error("noticeError", noticeError);
  // if (galleryError) console.error("galleryError", galleryError);
  // if (myCrewsError) console.error("myCrewsError", myCrewsError);

  const handleTabClick = (tab: string) => {
    console.log("Tab clicked:", tab);
    setCurrentTab(tab);
  };
  console.log("currentTab:", currentTab);

  const renderTab = () => {
    console.log("Rendering Tab:", currentTab);
    if (infoLoading || noticeLoading || galleryLoading || myCrewsLoading) {
      console.log("Loading data...");
      return <div>Loading...</div>;
    }

    if (infoError || noticeError || galleryError || myCrewsError) {
      console.log("Error loading data");
      return <div>Error loading data</div>;
    }

    const isUserCrewMember = myCrewsData?.crews.some(
      (crew) => crew.crewId === Number(crewId)
    );

    console.log("isUserCrewMember:", isUserCrewMember);

    if (!isUserCrewMember) {
      return <div>You are not a member of this crew.</div>;
    }

    switch (currentTab) {
      case "공지사항":
        return noticeData ? (
          <CrewNoticeOrganism notices={noticeData} />
        ) : (
          <div>No Notice Data</div>
        );
      case "정보":
        if (infoData) {
          console.log("infoData in '정보' tab:", infoData);
          return (
            <CrewInfoOrganism
              crewname={infoData.crewName}
              captain={infoData.captainName}
              slogan={infoData.slogan}
              area={infoData.area}
              birth={infoData.crewBirth}
              people={infoData.crewCount}
              introduction={infoData.introduction}
            />
          );
        } else {
          return <div>No Info Data</div>;
        }
      case "사진첩":
        return galleryData ? (
          <CrewAlbumOrganism
            photos={galleryData.flatMap((gallery) => gallery.imageUrls)}
          />
        ) : (
          <div>No Gallery Data</div>
        );
      default:
        if (infoData) {
          console.log("infoData in default case:", infoData);
          return (
            <CrewInfoOrganism
              crewname={infoData.crewName}
              captain={infoData.captainName}
              slogan={infoData.slogan}
              area={infoData.area}
              birth={infoData.crewBirth}
              people={infoData.crewCount}
              introduction={infoData.introduction}
            />
          );
        } else {
          return <div>No Info Data</div>;
        }
    }
  };

  const texts = ["정보", "공지사항", "사진첩"];

  return (
    <>
      <CrewHeaderBarOrganism />
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
        <NavTabMolecule
          texts={texts}
          onTabClick={handleTabClick}
          currentTab={currentTab}
        />
        {renderTab()}
      </div>
    </>
  );
};

export default CrewDetailTemplate;
