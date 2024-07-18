import React from "react";
import InputLabelComponent from "../atoms/InputLabelComponent";
import InputTextTypeComponent from "../atoms/InputTextTypeComponent";

type InputData = {
  id: string;
  title: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
};

const InputTextTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    return (
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputTextTypeComponent
          id={props.id}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
          name={props.name}
          ref={ref}
          hasError={props.hasError}
        />
        {props.error && (
          <p className="ps-4 pt-1 text-sm font-light text-red-500">
            {props.error}
          </p>
        )}
      </div>
    );
  }
);

export default InputTextTypeMolecule;
