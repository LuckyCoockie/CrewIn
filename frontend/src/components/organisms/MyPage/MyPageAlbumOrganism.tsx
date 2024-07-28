import React from "react";

type PhotosProps = {
  // postId: number;
  photos: string[];
};

const MyPageAlbumOrganism: React.FC = () => {
  return (
    <>
      {photos.map((photo, index) => (
        <img src={photo} alt="photo" key={index} className="w-1/3 h-1/3" />
      ))}
    </>
  );
};

export default MyPageAlbumOrganism;
