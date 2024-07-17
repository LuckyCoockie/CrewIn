import React, { forwardRef } from "react";

type InputData = {
  id: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
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
        className={`data-input border ${
          props.hasError
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300"
        }`}
        ref={ref}
      />
    );
  }
);

export default InputTextTypeComponent;
