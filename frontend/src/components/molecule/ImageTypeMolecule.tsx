import React from "react";
import InputImageComponent from "../atoms/InputImageComponent";
import InputLabelCompoent from "../atoms/InputLabelCompoent";

type InputData = {
  id: string;
  title: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    return (
      <>
        <InputLabelCompoent id={props.id} title={props.title} />
        <InputImageComponent
          placeholder={props.placeholder}
          id={props.id}
          name={props.name}
          ref={ref}
          onChange={props.onChange}
        />
      </>
    );
  }
);

export default ImageTypeMolecule;
