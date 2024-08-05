import React from "react";
import { MyGalleryDto, getPeopleGallery } from "../../../apis/api/mypage";
import InfiniteScrollComponent from "../../molecules/InfinityScrollMolecules";

import { useParams } from "react-router";

const PeopleAlbumOrganism: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();

  const fetchGallery = async (pageNo: number): Promise<MyGalleryDto[]> => {
    console.log(memberId);

    const response = await getPeopleGallery(pageNo - 1, Number(memberId));
    console.log(response.postGalleryList);

    return response.postGalleryList;
  };

  return (
    <div className="border-t">
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
    </div>
  );
};

export default PeopleAlbumOrganism;
