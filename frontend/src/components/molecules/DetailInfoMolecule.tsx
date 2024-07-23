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
        <div className="flex ms-2 items-center w-3/12">
          <SmallTitle data={props.title} />
        </div>
        <div className="ms-4 w-8/12">
          <SmallContent data={props.content} />
        </div>
      </div>
    </>
  );
};

export default DetailInfoMolecule;
