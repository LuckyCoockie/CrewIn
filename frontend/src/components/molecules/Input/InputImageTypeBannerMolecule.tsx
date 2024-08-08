import React from "react";
import InputBannermageComponent from "../../atoms/Input/InputBannermageComponent";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";

type InputData = {
  id: string;
  title: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputImageTypeBannerMolecule = React.forwardRef<
  HTMLInputElement,
  InputData
>((props, ref) => {
  return (
    <>
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputBannermageComponent
          placeholder={props.placeholder}
          id={props.id}
          name={props.name}
          ref={ref}
          onChange={props.onChange}
        />
      </div>
    </>
  );
});

export default InputImageTypeBannerMolecule;
