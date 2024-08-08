import React from "react";
import { Carousel } from "react-responsive-carousel";
import OneToOneImageMolecule from "../molecules/Image/OneToOneImageMolecule";
import DetailInfoMolecule from "../molecules/Content/DetailInfoMolecule";
import DetailInfoPaceMolecule from "../molecules/Content/DetailInfoPaceMolecule";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

import {
  SessionDetailDto,
  participateSession,
  cancelSession,
} from "../../apis/api/sessiondetail";

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
  } = detailData;
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
    const date = new Date(dateString.replace(" ", "T")); // 문자열을 Date 객체로 변환
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

  const handleParticipate = () => {
    participateSession({ sessionId });
  };
  const handleCancle = () => {
    cancelSession({ sessionId });
  };

  return (
    <>
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
          title="일시"
          content={`${formatKoreanDate(startAt)}\n${formatKoreanDate(endAt)}`}
        />
        <DetailInfoPaceMolecule title="페이스" content={pace} />
        <DetailInfoMolecule title="제한인원" content={`${maxPeople}명`} />
        <DetailInfoMolecule title="집결지" content={spot} />
        <DetailInfoMolecule title="코스" content={area} />
        <DetailInfoMolecule title="내용" content={content} />
        <div className="flex justify-center items-center">
          <img
            src={courseThumbnail}
            alt="courseThumbnail"
            className="m-4 w-2/3"
          />
        </div>
        {!isSessionHost && !isSessionStarted && (
          <LargeAbleButton onClick={handleParticipate} text="참가 신청" />
        )}
        {!isSessionHost && isSessionStarted && (
          <LargeAbleButton onClick={handleCancle} text="참가 취소" />
        )}
      </main>
    </>
  );
};

export default SessionDetailOrganism;
