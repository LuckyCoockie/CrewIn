import { useCallback } from "react";
import CrewListTemplate from "../components/templates/crew/CrewListTemplate";
import { getCrewList } from "../apis/api/crewlist";

const CrewSearchPage: React.FC = () => {
  const fetchData = useCallback(async (page: number) => {
    return (await getCrewList({ pageNo: page })).crews;
  }, []);

  return <CrewListTemplate fetchData={fetchData} />;
};

export default CrewSearchPage;
