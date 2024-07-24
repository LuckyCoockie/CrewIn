import React from "react";

type PhotosProps = {
  photos: string[];
};

const CrewAlbumOrganism: React.FC<PhotosProps> = ({ photos }) => {
  return (
    <>
      {photos.map((photo, index) => (
        <img src={photo} alt="photo" key={index} className="w-1/3 h-1/3" />
      ))}
    </>
  );
};

export default CrewAlbumOrganism;
