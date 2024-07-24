import { useCallback } from "react";
import { getSessionList } from "../apis/api/session";
import SessionListTemplate from "../components/templates/session/SessionListTemplate";

const CrewPage: React.FC = () => {
  const fetchData = useCallback(async (page: number) => {
    return (await getSessionList({ pageNo: page })).sessions;
  }, []);

  return (
    <main>
      <SessionListTemplate fetchData={fetchData} />;
    </main>
  );
};

export default CrewPage;
