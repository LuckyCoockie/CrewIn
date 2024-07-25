import { useCallback } from "react";
import { getSessionList, SessionRequestType } from "../apis/api/session";
import SessionListTemplate from "../components/templates/session/SessionListTemplate";

const SessionSearchPage: React.FC = () => {
  const fetchData = useCallback(async (type: SessionRequestType) => {
    console.log(type);
    return (await getSessionList({ type })).sessions;
  }, []);

  return <SessionListTemplate fetchData={fetchData} />;
};

export default SessionSearchPage;
