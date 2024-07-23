import React from "react";
import ThreeToTwoImageMolecule from "../molecules/Image/ThreeToTwoImageMolecule";
import crewbanner from "../../assets/images/crewinbanner.png";
import DetailInfoMolecule from "../molecules/Content/DetailInfoMolecule";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";

const CrewDetailOrganism: React.FC = () => {
  const Infos = {
    crewname: "CAUON",
    captain: "이예령씨",
    slogan: "같이의 가치",
    area: "서울특별시 동작구",
    birth: "2018년 4월 3일",
    people: "100",
    introduction: "중앙대학교 중앙동아리 러닝크루입니다.",
  };
  const texts = ["공지사항", "정보", "사진첩"];
  return (
    <>
      <ThreeToTwoImageMolecule src={crewbanner} alt="crewbanner" />
      <NavTabMolecule texts={texts} />
      <main>
        <DetailInfoMolecule title="크루명" content={Infos.crewname} />
        <DetailInfoMolecule title="크루장" content={Infos.captain} />
        <DetailInfoMolecule title="슬로건" content={Infos.slogan} />
        <DetailInfoMolecule title="활동지역" content={Infos.area} />
        <DetailInfoMolecule title="창설일" content={Infos.birth} />
        <DetailInfoMolecule title="인원" content={Infos.people + "명"} />
        <DetailInfoMolecule title="크루 소개" content={Infos.introduction} />
      </main>
    </>
  );
};

export default CrewDetailOrganism;
