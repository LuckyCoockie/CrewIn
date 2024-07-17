import React from "react";

type Info = {
  id: string;
  title: string;
};

const InputLabelCompoent: React.FC<Info> = (props) => {
  return (
    <>
      <label htmlFor={props.id} className="mb-2 block text-sm ">
        {props.title}
      </label>
    </>
  );
};

export default InputLabelCompoent;
