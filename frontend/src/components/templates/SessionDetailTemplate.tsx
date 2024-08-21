import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";
import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
  deleteSessionImage,
  UploadSessionImageRequestDto,
  uploadSessionImages,
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
import { uploadImage } from "../../apis/api/presigned";
import SpinnerComponent from "../atoms/SpinnerComponent";

type OwnDetailProps = {
  fetchSessionDetailData: (
    dto: GetSessionInfoRequestDto
  ) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchSessionDetailData,
}) => {
  const queryClient = useQueryClient();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [currentTab, setCurrentTab] = useState<string>("세션정보");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: detailData, refetch } = useQuery(
    ["detailData", { sessionId }],
    () => fetchSessionDetailData({ sessionId: Number(sessionId) })
  );

  const tabs = ["세션정보", "사진첩"];
  const isSessionStarted = detailData
    ? new Date(detailData.startAt) < new Date()
    : false;
  const convertRunningType = (runningType: string | undefined) => {
    if (runningType === "THUNDER") {
      return "번개런";
    } else if (runningType === "STANDARD") {
      return "정규런";
    } else if (runningType === "OPEN") {
      return "오픈런";
    }
  };
  const handleDownload = async () => {
    if (selectedImage) {
      try {
        const response = await fetch(selectedImage, {
          mode: "cors",
          cache: "no-cache",
        });
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
      deleteSessionImage(selectedImageId).then(() => {
        queryClient.refetchQueries([`sessionGallery`, `${sessionId}`]);

        setSelectedImage(null);
        setSelectedImageId(null);
        setIsDeleteModalOpen(false);
      });
    }
  };

  const handleUpload = async (files: FileList) => {
    if (files && files.length > 0) {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadImage(file))
      );

      const uploadDto: UploadSessionImageRequestDto = {
        sessionId: Number(sessionId),
        sessionImageUrls: uploadedUrls,
      };

      uploadSessionImages(uploadDto).then(() => {
        queryClient.refetchQueries([`sessionGallery`, `${sessionId}`]);
        setIsUploading(false);
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

  const calculateDuration = (
    start: string | undefined,
    end: string | undefined
  ) => {
    const startDate = new Date(start!.replace(" ", "T"));
    const endDate = new Date(end!.replace(" ", "T"));
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (durationHours === 0) {
      return `예정 소요시간 ${durationMinutes}분`;
    }
    return `${durationHours}시간 ${durationMinutes}분`;
  };

  const minutes = detailData ? Math.floor(detailData.pace / 60) : 0;
  const seconds = detailData ? detailData.pace % 60 : 0;

  const formatKoreanDate = (dateString: string | undefined) => {
    const date = new Date(dateString!.replace(" ", "T"));
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month} ${day}일 ${hours}:${minutes}`;
  };

  // 공유하기
  useEffect(() => {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY;
    if (!(window as any).Kakao.isInitialized()) {
      (window as any).Kakao.init(kakaoAppKey);
    }
  }, []);

  const handleShare = () => {
    const kakao = (window as any).Kakao;
    if (!kakao) {
      return;
    }

    kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title:
          `${detailData?.sessionName} (${convertRunningType(
            detailData?.sessionType
          )})` || "Session Details",
        description: `#${
          detailData?.spot || "Unknown Area"
        } #${formatKoreanDate(detailData?.startAt)} (${calculateDuration(
          detailData?.startAt,
          detailData?.endAt
        )}) #${detailData?.courseDistance}km #페이스 ${minutes}'${seconds}''`,
        imageUrl: detailData?.sessionPosters
          ? detailData.sessionPosters[0]
          : "",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "View Session",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
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
          <>
            <div className="relative">
              <Carousel
                showThumbs={false}
                showIndicators={true}
                showStatus={true}
                infiniteLoop={false}
                swipeable={true}
              >
                {detailData.sessionPosters.map((poster, index) => (
                  <OneToOneImageMolecule
                    key={index}
                    src={poster}
                    alt="poster"
                  />
                ))}
              </Carousel>
              {detailData && (
                <button
                  onClick={handleShare}
                  className="absolute bottom-2 right-2 text-white bg-[#2b2f40] bg-opacity-70 rounded-md py-2 font-bold px-2 text-xs"
                >
                  세션 공유하기
                </button>
              )}
            </div>
          </>
        )}

      {isUploading && (
        <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-black opacity-50">
          <SpinnerComponent />
        </div>
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
            sessionId={detailData.sessionId}
            onSelectImage={(imageUrl, imageId) => {
              setSelectedImage(imageUrl);
              setSelectedImageId(imageId);
            }}
            onUpload={handleUpload}
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
