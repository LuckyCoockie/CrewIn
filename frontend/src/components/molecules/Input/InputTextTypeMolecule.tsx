import React from "react";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";
import InputTextTypeComponent from "../../atoms/Input/InputTextTypeComponent";

type InputData = {
  id: string;
  title: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
  disabled?: boolean;
  value?: string;
};

const InputTextTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    return (
      <div className="mb-4 w-full">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputTextTypeComponent
          id={props.id}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
          name={props.name}
          ref={ref}
          hasError={props.hasError}
          disabled={props.disabled}
          value={props.value}
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
