import { useCallback } from "react";
import {
  getSessionList,
  GetSessionListRequestDto,
} from "../../apis/api/session";
import SessionListComponent from "../../components/organisms/SessionListOrganisms";

const SessionListPage: React.FC = () => {
  const fetchData = useCallback(async (dto: GetSessionListRequestDto) => {
    return (await getSessionList(dto)).sessions;
  }, []);

  return <SessionListComponent fetchData={fetchData} />;
};

export default SessionListPage;
