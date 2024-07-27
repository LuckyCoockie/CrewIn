import { useCallback } from "react";
import {
  getCrewInfo,
  GetCrewInfoRequestDto,
  getCrewNoticeList,
  GetCrewNoticeListRequestDto,
  getCrewGalleryList,
  GetCrewGalleryListRequestDto,
} from "../apis/api/crewdetail";
import React from "react";
import CrewDetailTemplate from "../components/templates/CrewDetailTemplate";

const CrewDetailPage: React.FC = () => {
  const fetchInfoData = useCallback(async (dto: GetCrewInfoRequestDto) => {
    const data = await getCrewInfo(dto);
    console.log("fetchInfoData", data);
    return data.crewInfo;
  }, []);

  const fetchNoticeData = useCallback(
    async (dto: GetCrewNoticeListRequestDto) => {
      const data = await getCrewNoticeList(dto);
      console.log("fetchNoticeData", data);
      return data.crewNoticeList;
    },
    []
  );

  const fetchGalleryData = useCallback(
    async (dto: GetCrewGalleryListRequestDto) => {
      const data = await getCrewGalleryList(dto);
      console.log("fetchGalleryData", data);
      return data.crewGalleryList;
    },
    []
  );

  return (
    <>
      <CrewDetailTemplate
        fetchInfoData={fetchInfoData}
        fetchNoticeData={fetchNoticeData}
        fetchGalleryData={fetchGalleryData}
      />
    </>
  );
};

export default CrewDetailPage;
