import React, { useState } from "react";
import { useQuery } from "react-query";
import CrewInfoOrganism from "../organisms/CrewInfoOrganism";
import CrewNoticeOrganism from "../organisms/CrewNoticeOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import ThreeToTwoImageMolecule from "../molecules/Image/ThreeToTwoImageMolecule";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewAlbumOrganism from "../organisms/CrewAlbumOrganism";
import CrewHeaderBarOrganism from "../organisms/CrewHeaderBarOrganism";

import {
  CrewInfoDto,
  CrewNoticeDto,
  CrewGalleryDto,
  GetCrewInfoRequestDto,
  GetCrewGalleryListRequestDto,
  GetCrewNoticeListRequestDto,
} from "../../apis/api/crewdetail";

type OwnDetailProps = {
  fetchInfoData: (dto: GetCrewInfoRequestDto) => Promise<CrewInfoDto>;
  fetchNoticeData: (
    dto: GetCrewNoticeListRequestDto
  ) => Promise<CrewNoticeDto[]>;
  fetchGalleryData: (
    dto: GetCrewGalleryListRequestDto
  ) => Promise<CrewGalleryDto[]>;
};

const CrewDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchInfoData,
  fetchNoticeData,
  fetchGalleryData,
}) => {
  const [currentTab, setCurrentTab] = useState<string>("정보");
  const crewId = 1;
  const pageNo = 0;

  // 크루 정보를 가져오는 React Query 훅
  const {
    data: infoData,
    isLoading: infoLoading,
    error: infoError,
  } = useQuery(["crewInfo", { crewId }], () => fetchInfoData({ crewId }));

  // 크루 공지사항을 가져오는 React Query 훅
  const {
    data: noticeData,
    isLoading: noticeLoading,
    error: noticeError,
  } = useQuery(["crewNotice", { crewId, pageNo }], () =>
    fetchNoticeData({ crewId, pageNo })
  );

  // 크루 사진첩을 가져오는 React Query 훅
  const {
    data: galleryData,
    isLoading: galleryLoading,
    error: galleryError,
  } = useQuery(["crewGallery", { crewId, pageNo }], () =>
    fetchGalleryData({ crewId, pageNo })
  );

  // 로그 출력
  console.log("infoData", infoData);
  console.log("noticeData", noticeData);
  console.log("galleryData", galleryData);

  // 오류 로그 출력
  if (infoError) console.error("infoError", infoError);
  if (noticeError) console.error("noticeError", noticeError);
  if (galleryError) console.error("galleryError", galleryError);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const renderTab = () => {
    if (infoLoading || noticeLoading || galleryLoading) {
      return <div>Loading...</div>;
    }

    if (infoError || noticeError || galleryError) {
      return <div>Error loading data</div>;
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
      <CrewHeaderBarOrganism />
      <header>
        <BackHeaderMediumOrganism
          text={infoData ? infoData.crewName : "Loading..."}
        />
      </header>
      <ThreeToTwoImageMolecule
        src={infoData ? infoData.imageUrl : ""}
        alt="crewbanner"
      />
      <div className="pb-12">
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
