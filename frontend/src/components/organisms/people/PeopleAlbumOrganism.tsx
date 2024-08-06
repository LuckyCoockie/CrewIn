import React from "react";
import { MyGalleryDto, getPeopleGallery } from "../../../apis/api/mypage";

import { useParams } from "react-router";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../../util/paging/type";

const PeopleAlbumOrganism: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();

  const fetchGallery = async (
    pageNo: number
  ): Promise<PageNationData<MyGalleryDto>> => {
    return getPeopleGallery(pageNo - 1, Number(memberId));
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
      />
    </div>
  );
};

export default PeopleAlbumOrganism;
