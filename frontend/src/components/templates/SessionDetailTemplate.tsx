import React, { useState, useRef } from "react";
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
import ModalConfirm from "../molecules/ModalConfirmMolecules";
import Modal from "../molecules/ModalMolecules";

type OwnDetailProps = {
  fetchSessionDetailData: (
    dto: GetSessionInfoRequestDto
  ) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchSessionDetailData,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [currentTab, setCurrentTab] = useState<string>("세션정보");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const albumRef = useRef<{ refreshGallery: () => void } | null>(null);

  const { data: detailData, refetch } = useQuery(
    ["detailData", { sessionId }],
    () => fetchSessionDetailData({ sessionId: Number(sessionId) })
  );

  const tabs = ["세션정보", "사진첩"];
  const isSessionStarted = detailData
    ? new Date(detailData.startAt) < new Date()
    : false;

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
        link.download = file.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      } catch (error) {
        setIsErrorModalOpen(true);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedImageId !== null) {
      await deleteSessionImage(selectedImageId)
        .then((r) => {
          setCurrentTab("");
          setTimeout(() => setCurrentTab("사진첩"), 0);
          setSelectedImage(null);
          setSelectedImageId(null);
          setIsDeleteModalOpen(false);
          console.log(r);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const openDeleteModal = (imageId: number) => {
    setSelectedImageId(imageId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
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
                onClick={() => openDeleteModal(selectedImageId!)}
                style={{ width: "40px", height: "40px" }}
              >
                <TrashIcon />
              </button>
              <button
                className="absolute ms-auto mt-auto right-2 bottom-2 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
                onClick={handleDownload}
                style={{ width: "40px", height: "40px" }}
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
      {isDeleteModalOpen && (
        <ModalConfirm
          title="사진 삭제"
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          type="delete"
        >
          <p>이 사진을 삭제하시겠습니까?</p>
        </ModalConfirm>
      )}
      {isErrorModalOpen && (
        <Modal title="다운로드 실패" onClose={closeErrorModal}>
          <p>이미지 다운로드에 실패했습니다. 잠시후 시도해주세요.</p>
        </Modal>
      )}
    </>
  );
};

export default SessionDetailTemplate;
