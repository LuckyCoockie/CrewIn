import React, { forwardRef } from "react";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";
import InputDropdownTypeComponent from "../../atoms/Input/InputDropdownTypeComponent";

type Option = {
  label: string;
  value: string | number;
};

type InputData = {
  id: string;
  title: string;
  options: Option[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  hasError?: boolean;
  disabled?: boolean;
  text: string;
};

const InputDropdonwTypeMolecule = forwardRef<HTMLSelectElement, InputData>(
  (props, ref) => {
    return (
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputDropdownTypeComponent
          id={props.id}
          options={props.options}
          value={props.value}
          onChange={props.onChange}
          ref={ref}
          hasError={props.hasError}
          disabled={props.disabled}
          text={props.text}
        />
        {props.error && (
          <p className="ps-3 pt-1 text-sm font-light text-red-500">
            {props.error}
          </p>
        )}
      </div>
    );
  }
);

export default InputDropdonwTypeMolecule;
