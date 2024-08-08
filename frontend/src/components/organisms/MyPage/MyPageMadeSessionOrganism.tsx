import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyMadeSessionDto } from "../../../apis/api/mypage";
import ErrorText from "../../atoms/ErrorText";
import SpinnerComponent from "../../atoms/SpinnerComponent";

interface MyPageMadeSessionOrganismProps {
  sessions: MyMadeSessionDto[];
  isMadeSessionsError: boolean;
  isMadeSessionsLoading: boolean;
}

const MyPageMadeSessionOrganism: React.FC<MyPageMadeSessionOrganismProps> = ({
  sessions,
  isMadeSessionsError,
  isMadeSessionsLoading,
}) => {

  return (
    <>
      <div className="flex items-center mb-4">
        <MediumTitleMolecule text="최근 생성한 세션" />
        {/* 전체 리스트로 이동 */}
        <IntoArrowButton router="" />
      </div>
      {!isMadeSessionsError ? (
        !isMadeSessionsLoading && (
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
        )
      ) : (
        <ErrorText text="예기치 못한 오류가 발생했습니다." />
      )}
      {isMadeSessionsLoading && <SpinnerComponent />}
    </>
  );
};

export default MyPageMadeSessionOrganism;
