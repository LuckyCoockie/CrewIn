import React, { useState } from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";
import {
  SessionDetailDto,
  GetSessionInfoRequestDto,
  getSessionAlbum,
  GetSessionAlbumDto,
} from "../../apis/api/sessiondetail";
import AttendanceButton from "../atoms/Button/AttendanceButton";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import SessionAlbumOrganism from "../organisms/SessionAlbumOrganism";
import { PageNationData } from "../../util/paging/type";

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
  const [currentTab, setCurrentTab] = useState<string>("세션정보");

  const {
    data: detailData,
    isLoading: detailLoading,
    error: detailError,
  } = useQuery(["detailData", { sessionId }], () =>
    fetchDetailData({ sessionId })
  );

  const fetchAlbumData = async (
    page: number
  ): Promise<PageNationData<GetSessionAlbumDto>> => {
    return getSessionAlbum(sessionId, page - 1);
  };

  if (detailError) console.error("detailError", detailError);

  const tabs = ["세션정보", "사진첩"];
  const isSessionStarted = detailData
    ? new Date(detailData.startAt) < new Date()
    : false;

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
                  currentTab={currentTab}
                />
              )}
              {currentTab === "세션정보" && (
                <SessionDetailOrganism detailData={detailData} />
              )}
              {currentTab === "사진첩" && (
                <SessionAlbumOrganism
                  sessionId={detailData.sessionId}
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
