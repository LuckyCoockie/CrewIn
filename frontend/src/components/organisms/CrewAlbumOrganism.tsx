import React from "react";
import {
  CrewGalleryDto,
  GetCrewGalleryListResponseDto,
} from "../../apis/api/crewdetail";
import InfiniteScrollComponent, {
  ItemComponentProps,
} from "../../util/paging/component/InfinityScrollComponent";

type PhotosProps = {
  fetchgalleryData: (pageNo: number) => Promise<GetCrewGalleryListResponseDto>;
  onItemClicked?: (pageNo: number, postId: number) => Promise<void>;
};

const CrewAlbumOrganism: React.FC<PhotosProps> = ({
  fetchgalleryData,
  onItemClicked,
}) => {
  return (
    <>
      <InfiniteScrollComponent
        fetchKey="crewGallery"
        fetchData={fetchgalleryData}
        ItemComponent={({
          pageNo,
          data,
        }: ItemComponentProps<CrewGalleryDto>) => (
          <img
            src={data.thumbnailImage}
            alt="photo"
            key={data.postId}
            className="w-1/3 h-1/3"
            style={{ border: "1px solid rgba(255, 0, 0, 0)" }}
            onClick={() => {
              if (onItemClicked) onItemClicked(pageNo, data.postId);
            }}
          />
        )}
        className="post-list"
      />
    </>
  );
};

export default CrewAlbumOrganism;
