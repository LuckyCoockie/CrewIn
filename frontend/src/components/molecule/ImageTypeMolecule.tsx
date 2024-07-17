import React from "react";
import ImageComponent from "../atoms/ImageComponent";
import InputLabelCompoent from "../atoms/InputLabelCompoent";

type InputData = {
  id: string;
  title: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageTypeMolecule = React.forwardRef<HTMLInputElement, InputData>((props, ref) => {
    return (
    <>
      <InputLabelCompoent id={props.id} title={props.title} />
      <ImageComponent
        placeholder={props.placeholder}
        id={props.id}
        name={props.name}
        ref={ref}
        onChange={props.onChange}
      />
    </>
  );
});

export default ImageTypeMolecule;
