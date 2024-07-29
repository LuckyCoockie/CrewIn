import { useCallback } from "react";
import CrewGallaryListDetailTemplate from "../components/templates/CrewGalleryDetailListTemplate";
import {
  getCrewGallaryDetailList,
  GetCrewGalleryListDetailReqeustParams,
} from "../apis/api/crewPostList";
import { useParams } from "react-router";
import qs from "query-string";

const CrewGallaryListDetailPage: React.FC = () => {
  const { crewId } = useParams();
  const { postId } = qs.parse(location.search);

  const fetchData = useCallback(
    async (dto: GetCrewGalleryListDetailReqeustParams) => {
      if (!crewId || !parseInt(crewId)) return [];
      return (
        await getCrewGallaryDetailList({
          crewId: parseInt(crewId),
          params: dto,
        })
      ).posts;
    },
    [crewId]
  );

  if (!crewId || !parseInt(crewId)) return "crewId가 필요합니다.";
  if (!postId || !parseInt(postId)) return "postId가 필요합니다.";

  return (
    <CrewGallaryListDetailTemplate postId={postId} fetchData={fetchData} />
  );
};

export default CrewGallaryListDetailPage;
