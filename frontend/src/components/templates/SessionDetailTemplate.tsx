import React, { useState } from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";
import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
  getSessionAlbum,
} from "../../apis/api/sessiondetail";
import AttendanceButton from "../atoms/Button/AttendanceButton";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import SessionAlbumOrganism from "../organisms/SessionAlbumOrganism";

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
  const [currentTab, setCurrentTab] = useState<string>("세션정보"); // 현재 선택된 탭 상태 추가

  const {
    data: detailData,
    isLoading: detailLoading,
    error: detailError,
  } = useQuery(["detailData", { sessionId }], () =>
    fetchDetailData({ sessionId })
  );

  // 로그 출력
  console.log("detailData", detailData);
  console.log(detailData?.isSessionHost);

  // 오류 로그 출력
  if (detailError) console.error("detailError", detailError);

  const tabs = ["세션정보", "사진첩"];

  // 현재 시각과 detailData.startAt 비교
  const isSessionStarted = detailData
    ? new Date(detailData.startAt) < new Date()
    : false;

  const fetchAlbumData = async (page: number): Promise<string[]> => {
    const response = await getSessionAlbum({ sessionId, pageNo: page });
    return response.sessionImages;
  };

  return (
    <>
      <header>
        <BackHeaderMediumOrganism
          text={detailData?.sessionName || "Loading..."}
        />
        <div className="flex ms-auto">
          <AttendanceButton />
          <EditDeleteDropdownOrganism
            type="SESSION"
            idData={detailData?.sessionId}
          />
        </div>
      </header>
      <div className="">
        {detailLoading ? (
          <Spinner />
        ) : (
          detailData && (
            <>
              {isSessionStarted && (
                <NavTabMolecule
                  texts={tabs}
                  onTabClick={setCurrentTab}
                  currentTab={currentTab} // 현재 선택된 탭 전달
                />
              )}
              {currentTab === "세션정보" && (
                <SessionDetailOrganism detailData={detailData} />
              )}
              {currentTab === "사진첩" && (
                <SessionAlbumOrganism
                  sessionId={detailData?.sessionId}
                  fetchAlbumData={fetchAlbumData}
                />
              )}
            </>
          )
        )}
      </div>
    </>
  );
};

export default SessionDetailTemplate;
