import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyParticipatedSessionDto } from "../../../apis/api/mypage";
import ErrorText from "../../atoms/ErrorText";
import SpinnerComponent from "../../atoms/SpinnerComponent";

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
  const convertText = (startAt: string, endAt: string) => {
    const now = new Date();
    const startAtDate = new Date(startAt);
    const endAtDate = new Date(endAt);

    if (now < startAtDate) {
      return "진행 예정";
    } else if (now >= startAtDate && now <= endAtDate) {
      return "진행중";
    } else {
      return "종료";
    }
  };
  return (
    <>
      <div className="flex items-center">
        <MediumTitleMolecule text="최근 참가한 세션" />
        {/* 전체 리스트로 이동 */}
        <IntoArrowButton router="/mypage/session/joined" />
      </div>
      {!isParticipatedSessionsError ? (
        !isParticipatedSessionsLoading && (
          <GaroScrollMolecule
            replaceText="최근 참가한 세션이 없습니다."
            propsData={sessions}
            renderItem={(data, index) => (
              <ListButtonMolecule
                key={index}
                src={data.sessionThumbnail}
                alt={data.sessionName}
                text={convertText(data.startAt, data.endAt)}
                router="session"
                routerId={data.sessionId}
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
