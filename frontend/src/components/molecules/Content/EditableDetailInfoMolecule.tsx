import React from "react";
import SmallTitle from "../../atoms/Title/SmallTitle";

type InfoData = {
  title: string;
  content?: string;
  onClick?: () => void;
};

const EditableDetailInfoMolecule: React.FC<InfoData> = (props) => {
  return (
    <>
      <div className="flex border-b py-4">
        <div className="flex ms-2 items-center w-3/12">
          <SmallTitle data={props.title} />
        </div>
        <p
          className="data-input bg-white border focus:outline-none ms-6 w-8/12"
          onClick={props.onClick}
        >
          {props.content}
        </p>
      </div>
    </>
  );
};

export default EditableDetailInfoMolecule;
