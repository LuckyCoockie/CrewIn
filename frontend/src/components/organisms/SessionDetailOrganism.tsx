import React from "react";
import { Carousel } from "react-responsive-carousel";
import OneToOneImageMolecule from "../molecules/Image/OneToOneImageMolecule";
import DetailInfoMolecule from "../molecules/Content/DetailInfoMolecule";
import DetailInfoPaceMolecule from "../molecules/Content/DetailInfoPaceMolecule";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

import { SessionDetailDto } from "../../apis/api/sessiondetail";

type SessionDetailOrganismProps = {
  detailData: SessionDetailDto;
};

const SessionDetailOrganism: React.FC<SessionDetailOrganismProps> = ({
  detailData,
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
  } = detailData;
  const isSessionStarted = detailData ? new Date(startAt) < new Date() : false;

  const handleParticipate = () => {
    
  }
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
        <DetailInfoMolecule title="크루명" content={crewName} />
        <DetailInfoMolecule
          title="개최자"
          content={hostNickname + `(${hostname})`}
        />
        <DetailInfoMolecule title="세션 유형" content={sessionType} />
        <DetailInfoMolecule title="일시" content={startAt + endAt} />
        <DetailInfoPaceMolecule title="페이스" content={pace} />
        <DetailInfoMolecule title="제한인원" content={`${maxPeople}명`} />
        <DetailInfoMolecule title="집결지" content={spot} />
        <DetailInfoMolecule title="코스" content={area} />
        <DetailInfoMolecule title="내용" content={content} />
        {!isSessionStarted && <LargeAbleButton onClick={handleParticipate} text="참가 신청" />}
      </main>
    </>
  );
};

export default SessionDetailOrganism;
