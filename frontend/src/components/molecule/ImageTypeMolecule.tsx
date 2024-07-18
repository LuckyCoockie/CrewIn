import React from "react";
import InputImageComponent from "../atoms/InputImageComponent";
import InputLabelComponent from "../atoms/InputLabelComponent";

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
        <div className="mb-4">
          <InputLabelComponent id={props.id} title={props.title} />
          <InputImageComponent
            placeholder={props.placeholder}
            id={props.id}
            name={props.name}
            ref={ref}
            onChange={props.onChange}
          />
        </div>
      </>
    );
  }
);

export default ImageTypeMolecule;
