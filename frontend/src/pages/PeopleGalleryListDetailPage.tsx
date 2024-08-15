import { useCallback } from "react";
import { useParams } from "react-router";
import qs from "query-string";
import PeopleGalleryDetailListTemplate from "../components/templates/PeopleGalleryDetailListTemplate";
import { getPeopleGalleryDetail } from "../apis/api/mypage";

const PeopleGalleryListDetailPage: React.FC = () => {
  const { memberId } = useParams();
  const { pageNo, postId } = qs.parse(location.search);

  const fetchData = useCallback(
    async (pageNo: number) => {
      if (!memberId || !parseInt(memberId))
        return {
          pageNo: 0,
          lastPageNo: 0,
          items: [],
        };
      return await getPeopleGalleryDetail({
        memberId: parseInt(memberId),
        pageNo: pageNo,
      });
    },
    [memberId]
  );

  if (!memberId || !parseInt(memberId)) return "memberId가 필요합니다.";

  return (
    <PeopleGalleryDetailListTemplate
      initPage={pageNo}
      initPostId={postId}
      fetchData={fetchData}
    />
  );
};

export default PeopleGalleryListDetailPage;
