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

import { useParams } from "react-router";

type OwnDetailProps = {
  fetchDetailData: (dto: GetSessionInfoRequestDto) => Promise<SessionDetailDto>;
};

const SessionDetailTemplate: React.FC<OwnDetailProps> = ({
  fetchDetailData,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [currentTab, setCurrentTab] = useState<string>("세션정보");

  const { data: detailData, error: detailError } = useQuery(
    ["detailData", { sessionId }],
    () => fetchDetailData({ sessionId: Number(sessionId) })
  );

  const fetchAlbumData = async (
    page: number
  ): Promise<PageNationData<GetSessionAlbumDto>> => {
    return getSessionAlbum(Number(sessionId), page - 1);
  };

  if (detailError) console.error("detailError", detailError);

  const tabs = ["세션정보", "사진첩"];
  const isSessionStarted = detailData
    ? new Date(detailData.startAt) < new Date()
    : false;

  if (!sessionId) return;

  return (
    <>
      <header>
        <BackHeaderMediumOrganism
          text={detailData?.sessionName || "Loading..."}
        />
        <div className="flex ms-auto">
          <AttendanceButton {...detailData} />
          {detailData?.isSessionHost && (
          <AttendanceButton />
          {detailData?.isSessionHost && !isSessionStarted && (
            <EditDeleteDropdownOrganism
              type="SESSION"
              idData={detailData?.sessionId}
            />
          )}
        </div>
      </header>
      <>
        {isSessionStarted && (
          <NavTabMolecule
            texts={tabs}
            onTabClick={setCurrentTab}
            currentTab={currentTab}
          />
        )}
        {currentTab === "세션정보" && detailData && (
          <SessionDetailOrganism
            detailData={detailData}
            sessionId={detailData?.sessionId}
          />
        )}
        {currentTab === "사진첩" && detailData && (
          <SessionAlbumOrganism
            sessionId={detailData.sessionId}
            fetchAlbumData={fetchAlbumData}
          />
        )}
      </>
    </>
  );
};

export default SessionDetailTemplate;
