import React from "react";
import InputImageComponent from "../../atoms/Input/InputImageComponent";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";

type InputData = {
  id: string;
  title: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text?: string
  previewUrl?: string
};

const InputImageTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    return (
      <>
        <div className="mb-4 w-full">
          <InputLabelComponent id={props.id} title={props.title} />
          <InputImageComponent
            placeholder={props.placeholder}
            id={props.id}
            name={props.name}
            ref={ref}
            onChange={props.onChange}
            text={props.text}
            previewUrl={props.previewUrl}
          />
        </div>
      </>
    );
  }
);

export default InputImageTypeMolecule;
