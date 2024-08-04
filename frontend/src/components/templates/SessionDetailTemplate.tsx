import React, { useState } from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";
import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
} from "../../apis/api/sessiondetail";

// 스피너 컴포넌트
const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="loader">Loading...</div>
  </div>
);

type OwnDetailProps = {
  fetchDetailData: (dto: GetSessionInfoRequestDto) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchDetailData,
}) => {
  const [sessionId] = useState<number>(1);

  const {
    data: detailData,
    isLoading: detailLoading, // isLoading 상태 사용
    error: detailError,
  } = useQuery(["detailData", { sessionId }], () =>
    fetchDetailData({ sessionId })
  );

  // 로그 출력
  console.log("detailData", detailData);
  console.log(detailData?.isSessionHost);

  // 오류 로그 출력
  if (detailError) console.error("detailError", detailError);

  return (
    <>
      <header className="">
        <BackHeaderMediumOrganism
          text={detailData?.sessionName || "Loading..."}
        />
      </header>
      <div className="">
        {detailLoading ? ( // detailLoading이 true일 때 스피너를 표시
          <Spinner />
        ) : (
          detailData && <SessionDetailOrganism detailData={detailData} />
        )}
      </div>
    </>
  );
};

export default SessionDetailTemplate;
