import React, { useState } from "react";
import { MyGalleryDto, getMyGallery } from "../../../apis/api/mypage";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../../util/paging/type";
import { useSelector } from "react-redux";
import { RootState } from "../../../modules";

type OwnProps = {
  onItemClicked: (pageNo: number, postId: number) => void;
};

const MyPageAlbumOrganism: React.FC<OwnProps> = ({ onItemClicked }) => {
  const memberId = useSelector((state: RootState) => state.auth.memberId);
  const [hasData, setHasData] = useState(true); // 데이터 유무를 추적하기 위한 상태

  const fetchGallery = async (
    pageNo: number
  ): Promise<PageNationData<MyGalleryDto>> => {
    const result = await getMyGallery(pageNo, memberId!);
    console.log(result);

    if (result.items.length === 0 && pageNo === 0) {
      setHasData(false); // 데이터가 없을 경우 상태를 false로 설정
    }
    return result;
  };

  return (
    <>
      {hasData ? (
        <InfiniteScrollComponent
          fetchKey="myGallery"
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
        <div className="text-center w-full text-gray-300 mt-3">
          저장된 앨범이 없습니다.
        </div>
      )}
    </>
  );
};

export default MyPageAlbumOrganism;
