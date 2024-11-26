import React from "react";
import DetailInfoMolecule from "../molecules/Content/DetailInfoMolecule";

type Infos = {
  crewName: string;
  captain: string;
  slogan: string;
  area: string;
  birth: string;
  people: number;
  introduction: string;
};

const CrewInfoOrganism: React.FC<Infos> = ({
  crewName,
  captain,
  slogan,
  area,
  birth,
  people,
  introduction,
}) => {
  return (
    <>
      <main>
        <DetailInfoMolecule title="크루명" content={crewName} />
        <DetailInfoMolecule title="크루장" content={captain} />
        <DetailInfoMolecule title="슬로건" content={slogan} />
        <DetailInfoMolecule title="활동지역" content={area} />
        <DetailInfoMolecule title="창설일" content={birth} />
        <DetailInfoMolecule title="인원" content={people + "명"} />
        <DetailInfoMolecule title="크루 소개" content={introduction} />
      </main>
    </>
  );
};

export default CrewInfoOrganism;
