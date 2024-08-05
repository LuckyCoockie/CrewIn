import React from "react";
import { MyGalleryDto, getMyGallery } from "../../../apis/api/mypage";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";

const MyPageAlbumOrganism: React.FC = () => {
  const fetchGallery = async (page: number): Promise<MyGalleryDto[]> => {
    const response = await getMyGallery(page);
    return response.postGalleryList;
  };

  return (
    <InfiniteScrollComponent
      fetchKey="myGallery"
      fetchData={fetchGallery}
      ItemComponent={({ data }) => (
        <img
          src={data.thumbnailImage}
          alt={`gallery-item-${data.postId}`}
          className="w-1/3 h-1/3"
        />
      )}
      className="grid grid-cols-3 gap-4"
      pageSize={10}
    />
  );
};

export default MyPageAlbumOrganism;
