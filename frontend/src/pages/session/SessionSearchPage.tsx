import { useCallback } from "react";
import { GetSessionListRequestDto } from "../../apis/api/session";
import SessionSearchTemplate from "../../components/templates/session/SessionListTemplate";
import { createSearchParams, useNavigate } from "react-router-dom";
import { removeUndefinedKey } from "../../util/removeUndefinedKey";

const SessionSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (dto: GetSessionListRequestDto) => {
      removeUndefinedKey(dto);
      navigate(`/session/search?${createSearchParams(dto)}`);
    },
    [navigate]
  );

  return <SessionSearchTemplate fetchData={fetchData} />;
};

export default SessionSearchPage;
