import React from "react";
import ImageButtonTitle from "../../atoms/Title/ImageButtonTitle";
import CrewMoreButton from "../../atoms/Button/CrewMoreButton";

type Infos = {
  text: string;
  router?: string;
  routerId?: number | string;
};

const RoundMoreMolecule: React.FC<Infos> = ({
  text,
  router,
  routerId,
}) => {
  return (
    <>
      <div className="flex flex-col mt-3 mx-1">
        <CrewMoreButton
          router={router}
          routerId={routerId}
        />
        <ImageButtonTitle text={text} />
      </div>
    </>
  );
};

export default RoundMoreMolecule;
