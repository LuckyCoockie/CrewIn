import React from "react";

type Info = {
  id: string;
  title: string;
};

const InputLabelCompoent: React.FC<Info> = (props) => {
  return (
    <>
      <label htmlFor={props.id} className="mb-2 block min-h-[1.5rem]">
        {props.title}
      </label>
    </>
  );
};

export default InputLabelCompoent;
