import { useCallback } from "react";
import CrewGalleryListDetailTemplate from "../components/templates/CrewGalleryDetailListTemplate";
import { getCrewGallaryDetailList } from "../apis/api/crewGallaryList";
import { useParams } from "react-router";
import qs from "query-string";

const CrewGalleryListDetailPage: React.FC = () => {
  const { crewId } = useParams();
  const { page, postId } = qs.parse(location.search);

  const fetchData = useCallback(
    async (pageNo: number) => {
      if (!crewId || !parseInt(crewId))
        return {
          pageNo: 0,
          lastPageNo: 0,
          items: [],
        };
      return await getCrewGallaryDetailList({
        crewId: parseInt(crewId),
        params: { pageNo: pageNo },
      });
    },
    [crewId]
  );

  if (!crewId || !parseInt(crewId)) return "crewId가 필요합니다.";

  return (
    <CrewGalleryListDetailTemplate
      initPage={page}
      initPostId={postId}
      fetchData={fetchData}
    />
  );
};

export default CrewGalleryListDetailPage;
