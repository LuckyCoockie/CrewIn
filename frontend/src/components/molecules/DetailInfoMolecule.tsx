import React from "react";
import SmallTitle from "../atoms/Title/SmallTitle";
import SmallContent from "../atoms/Content/SmallContent";

type InfoData = {
  title: string;
  content: string;
};

const DetailInfoMolecule: React.FC<InfoData> = (props) => {
  return (
    <>
      <div className="flex border-b py-4">
        <div className="w-1/3">
          <SmallTitle data={props.title} />
        </div>
        <div className="w-2/3">
          <SmallContent data={props.content} />
        </div>
      </div>
    </>
  );
};

export default DetailInfoMolecule;
