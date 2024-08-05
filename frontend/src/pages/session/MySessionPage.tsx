import { useCallback } from "react";
import {
  GetMySessionRequestDto,
  MySessionType,
  getMySessionList,
  mySessionTypeToLabel,
} from "../../apis/api/session";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import SessionListTemplate from "../../components/templates/session/SessionListTemplate";

const MySessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const onSearch = useCallback(
    async (dto: GetMySessionRequestDto) => {
      navigate(`/mypage/session/${type}?${createSearchParams(dto)}`);
    },
    [navigate, type]
  );

  const fetchData = useCallback(
    async (dto: GetMySessionRequestDto) => {
      dto.type = type as unknown as MySessionType;
      return (await getMySessionList(dto)).sessions;
    },
    [type]
  );

  if (type !== MySessionType.CREATED && type !== MySessionType.JOINED) return "type이 필요합니다.";

  return (
    <SessionListTemplate
      title={mySessionTypeToLabel(type)}
      onSearch={onSearch}
      fetchData={fetchData}
    />
  );
};

export default MySessionPage;
