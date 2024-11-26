import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyMadeSessionDto } from "../../../apis/api/mypage";
import ErrorText from "../../atoms/ErrorText";
import SpinnerComponent from "../../atoms/SpinnerComponent";
import { MySessionType } from "../../../apis/api/session";
import { useNavigate } from "react-router";
import RemainingTimer from "../../atoms/RemainingTimer";

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
  const navigate = useNavigate();
  const clickRouter = () => {
    navigate(`/mypage/session/created`);
  };
  // 세션 상태를 숫자로 변환하는 함수
  const getStatusValue = (startAt: string, endAt: string): number => {
    const now = new Date();
    const startAtDate = new Date(startAt);
    const endAtDate = new Date(endAt);

    if (now < startAtDate) {
      return 1; // 진행 예정
    } else if (now >= startAtDate && now <= endAtDate) {
      return 2; // 진행 중
    } else {
      return 3; // 종료
    }
  };

  // 세션을 정렬하는 함수
  const sortedSessions = sessions?.sort((a, b) => {
    return (
      getStatusValue(a.startAt, a.endAt) - getStatusValue(b.startAt, b.endAt)
    );
  });

  // 텍스트나 타이머를 변환하는 함수
  const convertText = (startAt: string, endAt: string) => {
    const now = new Date();
    const startAtDate = new Date(startAt);
    const endAtDate = new Date(endAt);

    if (now < startAtDate) {
      return <RemainingTimer startAt={startAt} />; // 타이머 표시
    } else if (now >= startAtDate && now <= endAtDate) {
      return "진행중";
    } else {
      return "종료";
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="cursor-pointer">
          <MediumTitleMolecule text="최근 생성한 세션" onClick={clickRouter} />
        </div>
        <IntoArrowButton router={`/mypage/session/${MySessionType.CREATED}`} />
      </div>
      {!isMadeSessionsError ? (
        !isMadeSessionsLoading && (
          <GaroScrollMolecule
            propsData={sortedSessions}
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
