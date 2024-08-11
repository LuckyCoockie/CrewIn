import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";
import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
} from "../../apis/api/sessiondetail";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import SessionAlbumOrganism from "../organisms/SessionAlbumOrganism";
import { useParams } from "react-router";
import AttendanceButton from "../atoms/Button/AttendanceButton";
import { Carousel } from "react-responsive-carousel";
import OneToOneImageMolecule from "../molecules/Image/OneToOneImageMolecule";

type OwnDetailProps = {
  fetchDetailData: (dto: GetSessionInfoRequestDto) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchDetailData,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [currentTab, setCurrentTab] = useState<string>("세션정보");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: detailData, error: detailError } = useQuery(
    ["detailData", { sessionId }],
    () => fetchDetailData({ sessionId: Number(sessionId) })
  );

  if (detailError) console.error("detailError", detailError);

  const tabs = ["세션정보", "사진첩"];
  const isSessionStarted = detailData
    ? new Date(detailData.startAt) < new Date()
    : false;

  // 사진첩 탭이 활성화될 때 첫 번째 이미지를 기본 선택
  useEffect(() => {
    if (currentTab === "사진첩" && !selectedImage) {
      const firstImage = null;
      if (firstImage) setSelectedImage(firstImage);
    }
  }, [currentTab, detailData, selectedImage]);

  if (!sessionId) return null;

  return (
    <>
      <header>
        <BackHeaderMediumOrganism
          text={detailData?.sessionName || "Loading..."}
        />
        <div className="flex ms-auto">
          {(detailData?.isSessionHost ||
            (detailData?.isJoined && detailData.sessionType !== "THUNDER") ||
            (detailData?.isJoined &&
              isSessionStarted &&
              detailData.sessionType === "THUNDER")) && (
            <AttendanceButton {...detailData} />
          )}
          {detailData?.isSessionHost && !isSessionStarted && (
            <EditDeleteDropdownOrganism
              type="SESSION"
              idData={detailData?.sessionId}
            />
          )}
        </div>
      </header>

      {/* 현재 탭에 따라 조건부 렌더링 */}
      {currentTab === "세션정보" &&
        detailData &&
        detailData.sessionPosters.length > 0 && (
          <Carousel
            showThumbs={false}
            showIndicators={true}
            showStatus={true}
            infiniteLoop={false}
            swipeable={true}
          >
            {detailData.sessionPosters.map((poster, index) => (
              <OneToOneImageMolecule key={index} src={poster} alt="poster" />
            ))}
          </Carousel>
        )}

      {currentTab === "사진첩" && (
        <div className="w-full aspect-w-1 aspect-h-1 flex justify-center items-center bg-gray-100 ">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="selected"
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="object-contain w-full h-full flex justify-center items-center text-gray-600 text-lg sm:text-xl">
              사진을 선택해보세요.
            </div>
          )}
        </div>
      )}
      {isSessionStarted && detailData?.isJoined && (
        <NavTabMolecule
          texts={tabs}
          onTabClick={setCurrentTab}
          currentTab={currentTab}
        />
      )}

      <>
        {currentTab === "세션정보" && detailData && (
          <SessionDetailOrganism
            detailData={detailData}
            sessionId={detailData?.sessionId}
          />
        )}
        {currentTab === "사진첩" && detailData && (
          <SessionAlbumOrganism
            sessionId={detailData.sessionId}
            onSelectImage={setSelectedImage}
          />
        )}
      </>
    </>
  );
};

export default SessionDetailTemplate;
