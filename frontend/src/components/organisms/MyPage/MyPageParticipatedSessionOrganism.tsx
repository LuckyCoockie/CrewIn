import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import InfinityGaroScrollMolecule from "../../molecules/InfinityGaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonmolecule";
import { MyParticipatedSessionDto, getMyParticipatedSessions } from "../../../apis/api/mypage";

const MyPageParticipatedSessionOrganism: React.FC = () => {
  const fetchParticipatedSessions = async (page: number): Promise<MyParticipatedSessionDto[]> => {
    const response = await getMyParticipatedSessions(page);
    return response.sessions;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <MediumTitleMolecule text="참가한 세션" />
        {/* 라우터 입력 */}
        <IntoArrowButton router="" />
      </div>
      <InfinityGaroScrollMolecule
        fetchKey="myParticipatedSessions"
        fetchData={fetchParticipatedSessions}
        ItemComponent={({ data }) => (
          <ListButtonMolecule
            src={data.imageUrl}
            alt={data.sessionName}
            text={data.sessionName}
          />
        )}
        className="whitespace-nowrap overflow-x-auto flex items-center space-x-3"
        pageSize={10}
      />
    </>
  );
};

export default MyPageParticipatedSessionOrganism;
