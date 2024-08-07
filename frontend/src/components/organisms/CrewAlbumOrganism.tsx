import React from "react";
import { CrewGalleryDto } from "../../apis/api/crewdetail";

type PhotosProps = {
  fetchgalleryData: CrewGalleryDto[];
};

const CrewAlbumOrganism: React.FC<PhotosProps> = ({ fetchgalleryData }) => {
  return (
    <>
      {fetchgalleryData.length > 0 ? (
        fetchgalleryData.map((photo, index) => (
          <img
            src={photo.thumbnailImage}
            alt="photo"
            key={index}
            className="w-1/3 h-1/3 p-0.5"
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
