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
        <MediumTitleMolecule text="최근 생성한 세션" />
        {/* 전체 리스트로 이동 */}
        <IntoArrowButton router="/mypage/session/created" />
      </div>
      {!isMadeSessionsError ? (
        !isMadeSessionsLoading && (
          <GaroScrollMolecule
            propsData={sessions}
            replaceText="최근 생성한 세션이 없습니다."
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
      {isMadeSessionsLoading && <SpinnerComponent />}
    </>
  );
};

export default MyPageMadeSessionOrganism;
