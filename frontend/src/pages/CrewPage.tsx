import { getCrewList } from "../apis/api/crew";
import { useCallback } from "react";
import CrewListTemplate from "../components/templates/crew/CrewListTemplate";

const CrewPage: React.FC = () => {
  const fetchData = useCallback(async (page: number) => {
    return (await getCrewList({ pageNo: page })).crews;
  }, []);

  return <CrewListTemplate fetchData={fetchData} />;
};

export default CrewPage;
