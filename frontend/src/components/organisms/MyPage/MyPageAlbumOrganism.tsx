import React from "react";
import { MyGalleryDto, getMyGallery } from "../../../apis/api/mypage";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../../util/paging/type";

const MyPageAlbumOrganism: React.FC = () => {
  const fetchGallery = async (
    pageNo: number
  ): Promise<PageNationData<MyGalleryDto>> => {
    return getMyGallery(pageNo);
  };

  return (
    <InfiniteScrollComponent
      fetchKey="myGallery"
      fetchData={fetchGallery}
      ItemComponent={({ data }) => (
        <img
          src={data.thumbnailImage}
          alt={`gallery-item-${data.postId}`}
          key={`gallery-${data.postId}`}
          className="w-full h-full"
          style={{ border: "1px solid rgba(255, 0, 0, 0)" }}
        />
      )}
      className="grid grid-cols-3"
    />
  );
};

export default MyPageAlbumOrganism;
