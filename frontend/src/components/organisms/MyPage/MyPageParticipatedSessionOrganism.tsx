import React from "react";
import GaroScrollmolecule from "../../molecules/List/GaroScrollmolecule";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";

const MyPageParticipatedSessionOrganism: React.FC = () => {
  return (
    <>
      <MediumTitleMolecule text="참가한 세션" />
      <GaroScrollmolecule />
    </>
  );
};

export default MyPageParticipatedSessionOrganism;
