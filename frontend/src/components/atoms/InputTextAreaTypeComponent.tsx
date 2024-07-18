import React from "react";

type InputData = {
  id: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  hasError?: boolean;
};

const InputTextAreaTypeComponent = React.forwardRef<
  HTMLTextAreaElement,
  InputData
>((props, ref) => {
  return (
    <textarea
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      ref={ref}
      className={`large-data-input border ${
        props.hasError
          ? "border-red-500 focus:border-red-500"
          : "border-gray-300"
      }`}
      placeholder={props.placeholder}
    />
  );
});

export default InputTextAreaTypeComponent;
