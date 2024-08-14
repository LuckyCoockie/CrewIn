import React, { useCallback } from "react";
import SessionDetailTemplate from "../components/templates/SessionDetailTemplate";
import {
  getSessionDetail,
  GetSessionInfoRequestDto,
} from "../apis/api/sessiondetail";

const SessionDetailPage: React.FC = () => {
  const fetchSessionDetailData = useCallback(async (dto: GetSessionInfoRequestDto) => {
    const data = await getSessionDetail(dto);
    return data;
  }, []);

  return (
    <>
      <SessionDetailTemplate fetchSessionDetailData={fetchSessionDetailData} />
    </>
  );
};

export default SessionDetailPage;
