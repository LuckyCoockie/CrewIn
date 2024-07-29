import React from "react";
import SmallTitle from "../../atoms/Title/SmallTitle";
import SmallPaceContent from "../../atoms/Content/SmallPaceContent";

type InfoData = {
  title: string;
  content: number;
};

const DetailInfoMolecule: React.FC<InfoData> = (props) => {
  return (
    <>
      <div className="flex border-b py-4">
        <div className="flex ms-2 items-center w-3/12">
          <SmallTitle data={props.title} />
        </div>
        <div className="ms-4 w-8/12">
          <SmallPaceContent data={props.content} />
        </div>
      </div>
    </>
  );
};

export default DetailInfoMolecule;
