import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";
import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
  deleteSessionImage,
} from "../../apis/api/sessiondetail";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import SessionAlbumOrganism from "../organisms/SessionAlbumOrganism";
import { useParams } from "react-router";
import AttendanceButton from "../atoms/Button/AttendanceButton";
import { Carousel } from "react-responsive-carousel";
import OneToOneImageMolecule from "../molecules/Image/OneToOneImageMolecule";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download.svg";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";

type OwnDetailProps = {
  fetchDetailData: (dto: GetSessionInfoRequestDto) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchDetailData,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [currentTab, setCurrentTab] = useState<string>("세션정보");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const albumRef = useRef<{ refreshGallery: () => void } | null>(null);

  const {
    data: detailData,
    error: detailError,
    refetch,
  } = useQuery(["detailData", { sessionId }], () =>
    fetchDetailData({ sessionId: Number(sessionId) })
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
    if (selectedImage) {
      try {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const fileName = selectedImage.split("/").pop() || "image.jpg";
        const file = new File([blob], fileName, { type: blob.type });

        const url = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = url;
        link.download = file.name; // 파일 이름 지정
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the image:", error);
      }
    }
  };

  const handleDelete = async (imageId: number) => {
    await deleteSessionImage(imageId)
      .then((r) => {
        setCurrentTab("");
        setTimeout(() => setCurrentTab("사진첩"), 0);
        setSelectedImage(null);
        setSelectedImageId(null);
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
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
                className="absolute ms-auto mb-auto right-2 top-2 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
                onClick={() => handleDelete(selectedImageId!)}
                style={{ width: "40px", height: "40px" }} // 크기를 작게 조정
              >
                <TrashIcon />
              </button>
              <button
                className="absolute ms-auto mt-auto right-2 bottom-2 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
                onClick={handleDownload}
                style={{ width: "40px", height: "40px" }} // 크기를 작게 조정
              >
                <DownloadIcon />
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
            onJoinChange={refetch}
          />
        )}
        {currentTab === "사진첩" && detailData && (
          <SessionAlbumOrganism
            ref={albumRef}
            sessionId={detailData.sessionId}
            onSelectImage={(imageUrl, imageId) => {
              setSelectedImage(imageUrl);
              setSelectedImageId(imageId);
            }}
          />
        )}
      </>
    </>
  );
};

export default SessionDetailTemplate;
