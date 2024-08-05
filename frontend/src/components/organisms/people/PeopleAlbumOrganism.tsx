import React from "react";
import { MyGalleryDto, getPeopleGallery } from "../../../apis/api/mypage";
import InfiniteScrollComponent from "../../molecules/InfinityScrollMolecules";

import { useParams } from "react-router";

const PeopleAlbumOrganism: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();

  const fetchGallery = async (pageNo: number): Promise<MyGalleryDto[]> => {
    const response = await getPeopleGallery(pageNo, Number(memberId));
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
      pageSize={5}
    />
  );
};

export default PeopleAlbumOrganism;
