import React from "react";
import { MyGalleryDto, getMyGallery } from "../../../apis/api/mypage";
import InfiniteScrollComponent from "../../molecules/InfinityScrollMolecules";

const MyPageAlbumOrganism: React.FC = () => {
  const fetchGallery = async (pageNo: number): Promise<MyGalleryDto[]> => {
    const response = await getMyGallery(pageNo - 1);
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
          className="w-full h-full"
        />
      )}
      className="grid grid-cols-3"
      pageSize={18}
    />
  );
};

export default MyPageAlbumOrganism;
