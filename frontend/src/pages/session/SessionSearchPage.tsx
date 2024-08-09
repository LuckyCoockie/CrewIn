import { useCallback } from "react";
import {
  GetSessionListRequestDto,
  getSessionList,
} from "../../apis/api/session";
import SessionSearchTemplate from "../../components/templates/session/SessionSearchTemplate";
import { createSearchParams, useNavigate } from "react-router-dom";
import { removeUndefinedKey } from "../../util/removeUndefinedKey";

const SessionSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const onSearch = useCallback(
    async (dto: GetSessionListRequestDto) => {
      removeUndefinedKey(dto);
      navigate(`/session?${createSearchParams(dto)}`, {
        replace: true,
      });
    },
    [navigate]
  );

  const onSessionItemClick = useCallback(
    async (sessionId: number) => {
      navigate(`/session/${sessionId}`);
    },
    [navigate]
  );

  const fetchData = useCallback(async (dto: GetSessionListRequestDto) => {
    return getSessionList(dto);
  }, []);

  return (
    <SessionSearchTemplate
      onSearch={onSearch}
      fetchData={fetchData}
      onSessionItemClick={onSessionItemClick}
    />
  );
};

export default SessionSearchPage;
