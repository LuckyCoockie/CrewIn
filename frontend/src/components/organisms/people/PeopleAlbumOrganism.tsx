import React, { useState } from "react";
import { MyGalleryDto, getPeopleGallery } from "../../../apis/api/mypage";
import { useParams } from "react-router";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../../util/paging/type";

type OwnProps = {
  onItemClicked: (pageNo: number, postId: number) => void;
};

const PeopleAlbumOrganism: React.FC<OwnProps> = ({ onItemClicked }) => {
  const { memberId } = useParams<{ memberId: string }>();
  const [hasData, setHasData] = useState(true);

  const fetchGallery = async (
    pageNo: number
  ): Promise<PageNationData<MyGalleryDto>> => {
    const result = await getPeopleGallery(pageNo, Number(memberId));

    if (result.items.length === 0 && pageNo === 0) {
      setHasData(false);
    }
    return result;
  };

  return (
    <div className="border-t">
      {hasData ? (
        <InfiniteScrollComponent
          fetchKey="peopleGallery"
          fetchData={fetchGallery}
          ItemComponent={({ pageNo, data }) => (
            <img
              src={data.thumbnailImage}
              alt={`gallery-item-${data.postId}`}
              key={`gallery-${data.postId}`}
              className="w-full h-full"
              style={{ border: "1px solid rgba(255, 0, 0, 0)" }}
              onClick={() => {
                if (onItemClicked) onItemClicked(pageNo, data.postId);
              }}
            />
          )}
          className="grid grid-cols-3"
        />
      ) : (
        <div className="text-center w-full text-sub mt-3">
          저장된 앨범이 없습니다.
        </div>
      )}
    </div>
  );
};

export default PeopleAlbumOrganism;
