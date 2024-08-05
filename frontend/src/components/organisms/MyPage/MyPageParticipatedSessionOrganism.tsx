import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyParticipatedSessionDto } from "../../../apis/api/mypage";

interface MyPageParticipatedSessionOrganismProps {
  sessions: MyParticipatedSessionDto[];
}

const MyPageParticipatedSessionOrganism: React.FC<
  MyPageParticipatedSessionOrganismProps
> = ({ sessions }) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <MediumTitleMolecule text="최근 참가한 세션" />
        {/* 전체 리스트로 이동 */}
        <IntoArrowButton router="" />
      </div>
      <GaroScrollMolecule
        replaceText="최근 참가한 세션이 없습니다."
        propsData={sessions}
        renderItem={(data, index) => (
          <ListButtonMolecule
            key={index}
            src={data.imageUrl}
            alt={data.sessionName}
            text={data.sessionName}
          />
        )}
      />
    </>
  );
};

export default MyPageParticipatedSessionOrganism;
