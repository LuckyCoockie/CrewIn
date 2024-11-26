import React, { useCallback, useState } from "react";
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
import SpinnerComponent from "../atoms/SpinnerComponent";
import ErrorText from "../atoms/ErrorText";

import {
  getCrewInfo,
  getCrewGalleryList,
  GetCrewGalleryListResponseDto,
} from "../../apis/api/crewdetail";
import { getMyCrews } from "../../apis/api/mycrew";
import { useNavigate, useParams } from "react-router";
import { createSearchParams } from "react-router-dom";
import QuitDropdownOrganism from "../organisms/QuitDropdownOrganism";

const CrewDetailTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<string>("공지사항");
  const { crewId } = useParams<{ crewId: string }>();
  const numericCrewId = Number(crewId);

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

  const handleFetchGalleryData = useCallback(
    async (pageNo: number): Promise<GetCrewGalleryListResponseDto> => {
      if (!crewId) {
        return {
          pageNo: 0,
          lastPageNo: 0,
          items: [],
        };
      }
      return getCrewGalleryList({
        crewId: parseInt(crewId),
        pageNo: pageNo,
      });
    },
    [crewId]
  );

  const userCrew = myCrewsData?.crews.find(
    (crew) => crew.crewId === numericCrewId
  );

  const isUserCrewMember = !!userCrew;
  const userPosition = userCrew?.position;

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const renderTab = () => {
    if (infoLoading || myCrewsLoading) {
      return <SpinnerComponent />;
    }

    if (infoError || myCrewsError) {
      return <ErrorText text="데이터를 로드하는데 오류가 발생했습니다." />;
    }

    if (!isUserCrewMember) {
      return (
        <CrewInfoOrganism
          crewName={infoData!.crewName}
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
        return (
          <CrewNoticeOrganism
            crewId={numericCrewId}
            isUserCrewMember={isUserCrewMember}
            userPosition={userPosition}
          />
        );
      case "정보":
        return infoData ? (
          <CrewInfoOrganism
            crewName={infoData.crewName}
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
        return (
          <CrewAlbumOrganism
            fetchgalleryData={handleFetchGalleryData}
            onItemClicked={async (pageNo, postId) =>
              navigate(
                `/crew/gallery/${crewId}?${createSearchParams({
                  pageNo: pageNo.toString(),
                  postId: postId.toString(),
                })}`
              )
            }
          />
        );
      default:
        return infoData ? (
          <CrewInfoOrganism
            crewName={infoData.crewName}
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

  const texts = ["공지사항", "정보", "사진첩"];

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
          {isUserCrewMember && (
            <div className="ms-1">
              <GroupsButton userPosition={userPosition!} />
            </div>
          )}
          {isUserCrewMember && userPosition === "CAPTAIN" && (
            <div className="ms-1">
              <MemberPlusButton />
            </div>
          )}
          {isUserCrewMember && userPosition === "CAPTAIN" && (
            <>
              <div className="ms-1">
                <EditDeleteDropdownOrganism
                  type="CREW"
                  idData={infoData?.crewId}
                />
              </div>
            </>
          )}
          {isUserCrewMember && userPosition !== "CAPTAIN" && (
            <>
              <div className="ms-1">
                <QuitDropdownOrganism crewId={Number(crewId)} />
              </div>
            </>
          )}
        </div>
      </header>
      <ThreeToTwoImageMolecule
        src={infoData ? infoData.banner : ""}
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
