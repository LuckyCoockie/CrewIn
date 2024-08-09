import React from "react";
import InputBannermageComponent from "../../atoms/Input/InputBannermageComponent";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";

type InputData = {
  id: string;
  title: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string
  previewUrl?: string
};

const InputImageTypeBannerMolecule = React.forwardRef<
  HTMLInputElement,
  InputData
>((props, ref) => {
  return (
    <>
      <div className="mb-4 w-full">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputBannermageComponent
          placeholder={props.placeholder}
          id={props.id}
          name={props.name}
          ref={ref}
          onChange={props.onChange}
          previewUrl={props.previewUrl}
        />
      </div>
    </>
  );
});

export default InputImageTypeBannerMolecule;
