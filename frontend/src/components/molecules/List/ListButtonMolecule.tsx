import React from "react";
import ImageButton from "../../atoms/Button/ImageButton";
import ImageButtonTitle from "../../atoms/Title/ImageButtonTitle";

type Infos = {
  src: string;
  alt: string;
  text: string | JSX.Element;
  router?: string;
  routerId?: number | string;
};

const ListButtonMolecule: React.FC<Infos> = ({
  src,
  alt,
  text,
  router,
  routerId,
}) => {
  return (
    <>
      <div className="flex flex-col mt-3 mx-1">
        <ImageButton src={src} alt={alt} router={router} routerId={routerId} />
        <ImageButtonTitle text={text} />
      </div>
    </>
  );
};

export default ListButtonMolecule;
