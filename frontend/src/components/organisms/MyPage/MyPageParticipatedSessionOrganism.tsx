import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyParticipatedSessionDto } from "../../../apis/api/mypage";
import ErrorText from "../../atoms/ErrorText";
import SpinnerComponent from "../../atoms/SpinnerComponent";
import { MySessionType } from "../../../apis/api/session";

interface MyPageParticipatedSessionOrganismProps {
  sessions: MyParticipatedSessionDto[];
  isParticipatedSessionsLoading: boolean;
  isParticipatedSessionsError: boolean;
}

const MyPageParticipatedSessionOrganism: React.FC<
  MyPageParticipatedSessionOrganismProps
> = ({
  sessions,
  isParticipatedSessionsLoading,
  isParticipatedSessionsError,
}) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <MediumTitleMolecule text="최근 참가한 세션" />
        <IntoArrowButton router={`/mypage/session/${MySessionType.CREATED}`} />
      </div>
      {!isParticipatedSessionsError ? (
        !isParticipatedSessionsLoading && (
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
        )
      ) : (
        <ErrorText text="예기치 못한 오류가 발생했습니다." />
      )}
      {isParticipatedSessionsLoading && <SpinnerComponent />}
    </>
  );
};

export default MyPageParticipatedSessionOrganism;
