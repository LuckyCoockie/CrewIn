import React, { useState, useEffect } from "react";
import {
  CrewGalleryDto,
  GetCrewGalleryListResponseDto,
} from "../../apis/api/crewdetail";
import InfiniteScrollComponent, {
  ItemComponentProps,
} from "../../util/paging/component/InfinityScrollComponent";
import SpinnerComponent from "../atoms/SpinnerComponent";

type PhotosProps = {
  fetchgalleryData: (pageNo: number) => Promise<GetCrewGalleryListResponseDto>;
  onItemClicked?: (pageNo: number, postId: number) => Promise<void>;
};

const CrewAlbumOrganism: React.FC<PhotosProps> = ({
  fetchgalleryData,
  onItemClicked,
}) => {
  const [photos, setPhotos] = useState<CrewGalleryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchgalleryData(0);
      setPhotos(data.items);
      setIsLoading(false);
    };

    loadData();
  }, [fetchgalleryData]);

  if (isLoading) {
    return <SpinnerComponent />;
  }

  if (photos.length === 0) {
    return (
      <div className="text-sub w-full text-center mt-4">
        게시된 사진이 없습니다.
      </div>
    );
  }

  return (
    <InfiniteScrollComponent
      fetchKey="crewGallery"
      fetchData={fetchgalleryData}
      ItemComponent={({ pageNo, data }: ItemComponentProps<CrewGalleryDto>) => (
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
  );
};

export default CrewAlbumOrganism;
