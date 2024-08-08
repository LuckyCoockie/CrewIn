import React from "react";
import { CrewGalleryDto } from "../../apis/api/crewdetail";

type PhotosProps = {
  fetchgalleryData: CrewGalleryDto[];
  onItemClicked?: (postId: number) => Promise<void>;
};

const CrewAlbumOrganism: React.FC<PhotosProps> = ({
  fetchgalleryData,
  onItemClicked,
}) => {
  return (
    <>
      {fetchgalleryData.length > 0 ? (
        fetchgalleryData.map((photo, index) => (
          <img
            src={photo.thumbnailImage}
            alt="photo"
            key={index}
            className="w-1/3 h-1/3"
            style={{ border: "1px solid rgba(255, 0, 0, 0)" }}
            onClick={() => {
              if (onItemClicked) onItemClicked(photo.postId);
            }}
          />
        ))
      ) : (
        <div className="text-gray-300 w-full text-center mt-4">
          등록된 사진첩이 없습니다.
        </div>
      )}
    </>
  );
};

export default CrewAlbumOrganism;
