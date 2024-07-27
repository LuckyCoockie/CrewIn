import React from "react";
import ImageButton from "../../atoms/Button/ImageButton";
import ImageButtonTitle from "../../atoms/Title/ImageButtonTitle";

type Infos = {
  src: string;
  alt: string;
  text: string;
};

const ListButtonmolecule: React.FC<Infos> = ({ src, alt, text }) => {
  return (
    <>
      <div className="w-full mt-3 mx-1">
        <ImageButton src={src} alt={alt} />
        <ImageButtonTitle text={text} />
      </div>
    </>
  );
};

export default ListButtonmolecule;
