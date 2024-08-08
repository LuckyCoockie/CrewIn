import React from "react";
import ImageButtonTitle from "../../atoms/Title/ImageButtonTitle";
import CrewImageButton from "../../atoms/Button/CrewImageButton";

type Infos = {
  src: string;
  alt: string;
  text: string;
  router?: string;
  routerId?: number | string;
};

const RoundButtonMolecule: React.FC<Infos> = ({
  src,
  alt,
  text,
  router,
  routerId,
}) => {
  return (
    <>
      <div className="flex flex-col mt-3 mx-1">
        <CrewImageButton
          src={src}
          alt={alt}
          router={router}
          routerId={routerId}
        />
        <ImageButtonTitle text={text} />
      </div>
    </>
  );
};

export default RoundButtonMolecule;
