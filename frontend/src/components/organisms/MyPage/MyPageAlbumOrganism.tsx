import React from "react";
import logo from "../../../assets/images/crewinlogo.png";

const MyPageAlbumOrganism: React.FC = () => {
  const photos = [
    logo,
    logo,
    logo,
    logo,
    logo,
    logo,
    logo,
    logo,
    logo,
    logo,
    logo,
  ];
  return (
    <>
      {photos.map((photo, index) => (
        <img src={photo} alt="photo" key={index} className="w-1/3 h-1/3" />
      ))}
    </>
  );
};

export default MyPageAlbumOrganism;
