import { useCallback } from "react";
import {
  getSessionList,
  GetSessionListRequestDto,
} from "../../../apis/api/session";
import SessionListComponent from "../../organisms/SessionListOrganism";

const SessionListTemplate: React.FC = () => {
  const fetchData = useCallback(async (dto: GetSessionListRequestDto) => {
    return getSessionList(dto);
  }, []);

  return <SessionListComponent fetchData={fetchData} />;
};

export default SessionListTemplate;
