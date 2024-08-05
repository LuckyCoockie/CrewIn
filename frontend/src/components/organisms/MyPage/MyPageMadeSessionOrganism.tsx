import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyMadeSessionDto } from "../../../apis/api/mypage";

interface MyPageMadeSessionOrganismProps {
  sessions: MyMadeSessionDto[];
}

const MyPageMadeSessionOrganism: React.FC<MyPageMadeSessionOrganismProps> = ({
  sessions,
}) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <MediumTitleMolecule text="최근 생성한 세션" />
        {/* 전체 리스트로 이동 */}
        <IntoArrowButton router="" />
      </div>
      <GaroScrollMolecule
        propsData={sessions}
        replaceText="최근 생성한 세션이 없습니다."
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

export default MyPageMadeSessionOrganism;
