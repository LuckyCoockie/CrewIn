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
import { FaDownload } from "react-icons/fa"; // 다운로드 아이콘을 위해 react-icons 사용

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

  const handleDownload = async () => {
    console.log(selectedImage);

    if (selectedImage) {
      try {
        // 이미지 URL에서 Blob 데이터를 가져옴
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const fileName = selectedImage.split("/").pop() || "image.jpg";
        const file = new File([blob], fileName, { type: blob.type });
        console.log(file);

        // Blob URL 생성
        const url = window.URL.createObjectURL(blob);

        // 가상의 링크 생성
        const link = document.createElement("a");
        link.href = url;
        link.download = "downloaded-image.jpg"; // 파일 이름 지정
        document.body.appendChild(link);

        // 링크 클릭 시 파일 다운로드
        link.click();

        // 사용한 링크와 URL 객체 제거
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the image:", error);
      }
    }
  };
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
        <div className="relative w-full aspect-w-1 aspect-h-1 flex justify-center items-center bg-gray-100 ">
          {selectedImage ? (
            <>
              <img
                src={selectedImage}
                alt="selected"
                className="object-contain w-full h-full"
              />
              <button
                className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full"
                onClick={handleDownload}
              >
                <FaDownload size={24} />
              </button>
            </>
          ) : (
            <div className="object-contain w-full h-full flex justify-center items-center text-gray-400 text-lg sm:text-xl">
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
