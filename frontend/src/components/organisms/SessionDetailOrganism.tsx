import React, { useCallback, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import OneToOneImageMolecule from "../molecules/Image/OneToOneImageMolecule";
import DetailInfoMolecule from "../molecules/Content/DetailInfoMolecule";
import DetailInfoPaceMolecule from "../molecules/Content/DetailInfoPaceMolecule";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import Modal from "../molecules/ModalMolecules";
import ModalConfirm from "../molecules/ModalConfirmMolecules";

import {
  SessionDetailDto,
  participateSession,
  cancelSession,
} from "../../apis/api/sessiondetail";
import { useNavigate } from "react-router";

type SessionDetailOrganismProps = {
  detailData: SessionDetailDto;
  sessionId: number;
};

const SessionDetailOrganism: React.FC<SessionDetailOrganismProps> = ({
  detailData,
  sessionId,
}) => {
  const {
    hostname,
    hostNickname,
    maxPeople,
    crewName,
    sessionType,
    startAt,
    endAt,
    pace,
    spot,
    area,
    content,
    sessionPosters,
    isSessionHost,
    courseThumbnail,
    currentPeople,
    courseDistance,
    courseId,
  } = detailData;

  const [isJoined, setIsJoined] = useState(detailData.isJoined);
  const [showModal, setShowModal] = useState(false); // 참가 완료 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 참가 취소 확인 모달 상태
  const [isJoinSubmit, setIsJoinSubmit] = useState(false);
  const [isOutSubmit, setIsOutSubmit] = useState(false);

  const navigate = useNavigate();

  const isSessionStarted = detailData ? new Date(startAt) < new Date() : false;

  const sessionTypeSubstitute = (type: string) => {
    if (type === "OPEN") {
      return "오픈런";
    } else if (type === "STANDARD") {
      return "정규런";
    } else if (type === "THUNDER") {
      return "번개런";
    }
  };

  const formatKoreanDate = (dateString: string) => {
    const date = new Date(dateString.replace(" ", "T"));
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
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const adjustedHours = hours % 12 || 12; // 12시간 형식으로 변환
    return `${month} ${day}일 ${period} ${adjustedHours}시 ${minutes}분`;
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start.replace(" ", "T"));
    const endDate = new Date(end.replace(" ", "T"));
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

  const handleParticipate = async () => {
    setIsJoinSubmit(true);
    try {
      await participateSession(sessionId);
      setIsJoined(true);
      setShowModal(true); // 참가 완료 모달 표시
      setIsJoinSubmit(false);
    } catch (error) {
      console.error("참가 신청 실패:", error);
      setIsJoinSubmit(false);
    }
  };

  const handleCancel = async () => {
    setIsOutSubmit(true);
    try {
      await cancelSession(sessionId);
      setIsJoined(false);
      setShowConfirmModal(false); // 참가 취소 확인 모달 닫기
      setIsOutSubmit(false);
    } catch (error) {
      console.error("참가 취소 실패:", error);
      setIsOutSubmit(false);
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(true); // 참가 취소 확인 모달 표시
  };

  const handelCourseClick = useCallback(() => {
    navigate(`/course/${courseId}`);
  }, [courseId, navigate]);

  return (
    <>
      {showModal && (
        <Modal title="참가 완료" onClose={() => setShowModal(false)}>
          <p>참가 신청이 완료되었습니다!</p>
        </Modal>
      )}
      {showConfirmModal && (
        <ModalConfirm
          title="참가 취소"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleCancel}
        >
          <p>정말로 참가를 취소하시겠습니까?</p>
        </ModalConfirm>
      )}
      <Carousel
        showThumbs={false}
        showIndicators={true}
        showStatus={true}
        infiniteLoop={false}
        swipeable={true}
      >
        {sessionPosters.map((poster, index) => (
          <OneToOneImageMolecule key={index} src={poster} alt="poster" />
        ))}
      </Carousel>
      <main>
        {crewName && <DetailInfoMolecule title="크루명" content={crewName} />}
        <DetailInfoMolecule
          title="개최자"
          content={hostNickname + `(${hostname})`}
        />
        <DetailInfoMolecule
          title="세션 유형"
          content={sessionTypeSubstitute(sessionType)}
        />
        <DetailInfoMolecule
          title="집결시간"
          content={`${formatKoreanDate(startAt)}`}
        />
        <DetailInfoMolecule
          title="종료시간"
          content={`${formatKoreanDate(endAt)} \n (${calculateDuration(
            startAt,
            endAt
          )})`}
        />
        <DetailInfoPaceMolecule title="평균 페이스" content={pace} />
        <DetailInfoMolecule title="거리" content={`${courseDistance}km`} />
        <DetailInfoMolecule title="제한인원" content={`${maxPeople}명`} />
        <DetailInfoMolecule title="집결지" content={spot} />
        <DetailInfoMolecule title="코스" content={area} />
        <DetailInfoMolecule title="내용" content={content} />
        <div
          className="flex justify-center items-center"
          onClick={handelCourseClick}
        >
          <img
            src={courseThumbnail}
            alt="courseThumbnail"
            className="m-4 w-2/3"
          />
        </div>
        {!isSessionHost &&
          !isSessionStarted &&
          !isJoined &&
          currentPeople < maxPeople && (
            <LargeAbleButton
              onClick={handleParticipate}
              text="참가 신청"
              isLoading={isJoinSubmit}
            />
          )}
        {!isSessionHost &&
          !isSessionStarted &&
          !isJoined &&
          currentPeople >= maxPeople && <LargeDisableButton text="인원 마감" />}
        {!isSessionHost &&
          !isSessionStarted &&
          isJoined &&
          currentPeople < maxPeople && (
            <LargeAbleButton
              onClick={handleConfirmCancel}
              text="참가 취소"
              isLoading={isOutSubmit}
            />
          )}
        {isSessionStarted && <LargeDisableButton text="종료된 세션" />}
      </main>
    </>
  );
};

export default SessionDetailOrganism;
