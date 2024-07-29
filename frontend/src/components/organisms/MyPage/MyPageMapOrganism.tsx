import React from "react";
import GaroScrollmolecule from "../../molecules/List/GaroScrollmolecule";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";

const MyPageMapOrganism: React.FC = () => {
  return (
    <>
      <MediumTitleMolecule text="지도 목록" />
      <GaroScrollmolecule />
    </>
  );
};

export default MyPageMapOrganism;
