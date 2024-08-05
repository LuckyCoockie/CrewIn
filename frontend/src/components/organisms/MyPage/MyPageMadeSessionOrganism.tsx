import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import IntoArrowButton from "../../atoms/Button/IntoArrowButton";
import InfinityGaroScrollMolecule from "../../molecules/InfinityGaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import { MyMadeSessionDto, getMyMadeSessions } from "../../../apis/api/mypage";

const MyPageMadeSessionOrganism: React.FC = () => {
  const fetchMadeSessions = async (
    page: number
  ): Promise<MyMadeSessionDto[]> => {
    const response = await getMyMadeSessions(page);
    return response.sessions;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <MediumTitleMolecule text="만든 세션" />
        <IntoArrowButton router="" />
      </div>
      <InfinityGaroScrollMolecule
        fetchKey="myMadeSessions"
        fetchData={fetchMadeSessions}
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

export default MyPageMadeSessionOrganism;
