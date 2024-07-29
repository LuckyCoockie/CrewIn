import React, { useState } from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";

import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
} from "../../apis/api/sessiondetail";

type OwnDetailProps = {
  fetchDetailData: (dto: GetSessionInfoRequestDto) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchDetailData,
}) => {
  const [sessionId] = useState<number>(1);

  const {
    data: detailData,
    // isLoading: detailLoading,
    error: detailError,
  } = useQuery(["detailData", { sessionId }], () =>
    fetchDetailData({ sessionId })
  );

  // 로그 출력
  console.log("detailData", detailData);

  // 오류 로그 출력
  if (detailError) console.error("detailError", detailError);

  return (
    <>
      <header className="py-6">
        <BackHeaderMediumOrganism text={detailData?.sessionName || "Loading..."} />
      </header>
      <div className="pb-20">
        {detailData && <SessionDetailOrganism detailData={detailData} />}
      </div>
    </>
  );
};

export default SessionDetailTemplate;
