import React, { forwardRef } from "react";

type InputData = {
  id: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
  disabled?: boolean;
  value?: string;
};

const InputTextTypeComponent = forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    return (
      <input
        id={props.id}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        name={props.name}
        className={`data-input bg-white border focus:outline-none ${
          props.hasError
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300"
        }`}
        ref={ref}
        disabled={props.disabled}
        defaultValue={props.value}
      />
    );
  }
);

export default InputTextTypeComponent;
