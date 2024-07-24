import { useCallback } from "react";
import { getSessionList, SessionRequestType } from "../apis/api/session";
import SessionListTemplate from "../components/templates/session/SessionListTemplate";

const SessionPage: React.FC = () => {
  const fetchData = useCallback(async (type: SessionRequestType) => {
    console.log(type);
    return (await getSessionList({ type })).sessions;
  }, []);

  return (
    <main>
      <SessionListTemplate fetchData={fetchData} />
    </main>
  );
};

export default SessionPage;
