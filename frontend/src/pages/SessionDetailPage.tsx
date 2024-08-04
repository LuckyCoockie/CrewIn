import React, { useCallback } from "react";
import SessionDetailTemplate from "../components/templates/SessionDetailTemplate";
import {
  getSessionDetail,
  GetSessionInfoRequestDto,
} from "../apis/api/sessiondetail";

const SessionDetailPage: React.FC = () => {
  const fetchDetailData = useCallback(async (dto: GetSessionInfoRequestDto) => {
    const data = await getSessionDetail(dto);
    console.log("fetchDetailData", data);
    return data;
  }, []);

  return (
    <>
      <SessionDetailTemplate fetchDetailData={fetchDetailData} />
    </>
  );
};

export default SessionDetailPage;
