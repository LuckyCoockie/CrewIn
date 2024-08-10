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

  const sortedSessions = sessions?.sort((a, b) => {
    const aStatus = convertText(a.startAt, a.endAt);
    const bStatus = convertText(b.startAt, b.endAt);
    const statusOrder = {
      "진행 예정": 1,
      진행중: 2,
      종료: 3,
    };

    return statusOrder[aStatus] - statusOrder[bStatus];
  });

  return (
    <>
      <div className="flex items-center cursor-pointer" onClick={clickRouter}>
        <MediumTitleMolecule text="최근 생성한 세션" />
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
