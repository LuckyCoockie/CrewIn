import React, { useEffect } from "react";
import poster from "../../assets/images/poster.png";
import poster2 from "../../assets/images/crewinbanner.png";
import { Carousel } from "react-responsive-carousel";
import OneToOneImageMolecule from "../molecules/Image/OneToOneImageMolecule";
import DetailInfoMolecule from "../molecules/Content/DetailInfoMolecule";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";

type SessionDetailOrganismProps = {
  setName: (name: string) => void;
};

const SessionDetailOrganism: React.FC<SessionDetailOrganismProps> = ({
  setName,
}) => {
  const Infos = {
    posters: [poster, poster2],
    name: "2024 CAUON 정규런",
    crew: "CAUON",
    type: "정규런",
    starttime: "2024.07.12(금) 07:30 - 09:00",
    pace: "6'00''",
    spot: "흑석역",
    course: "사진으로 불러올 예정",
    content:
      "우천 시 취소될 수 있습니다. 정규런 이후 뒷풀이가 있을 예정입니다.",
  };

  useEffect(() => {
    setName(Infos.name);
  }, [Infos.name, setName]);
  return (
    <>
      <Carousel
        showThumbs={false}
        showIndicators={true}
        showStatus={true}
        infiniteLoop={false}
        swipeable={true}
      >
        {Infos.posters.map((poster, index) => (
          <OneToOneImageMolecule key={index} src={poster} alt="poster" />
        ))}
      </Carousel>
      <main>
        <DetailInfoMolecule title="크루명" content={Infos.crew} />
        <DetailInfoMolecule title="세션 유형" content={Infos.type} />
        <DetailInfoMolecule title="일시" content={Infos.starttime} />
        <DetailInfoMolecule title="페이스" content={Infos.pace} />
        <DetailInfoMolecule title="집결지" content={Infos.spot} />
        <DetailInfoMolecule title="코스" content={Infos.course} />
        <DetailInfoMolecule title="내용" content={Infos.content} />
        <LargeAbleButton text="참가 신청" />
      </main>
    </>
  );
};

export default SessionDetailOrganism;
