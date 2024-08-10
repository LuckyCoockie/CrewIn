import React from "react";

type Option = {
  label: string;
  value: string | number;
};

type InputData = {
  id: string;
  options: Option[];
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  hasError?: boolean;
  disabled?: boolean;
  text: string;
};

const InputDropdownTypeComponent = React.forwardRef<
  HTMLSelectElement,
  InputData
>((props, ref) => {
  return (
    <select
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      ref={ref}
      className={`data-input border text-left focus:ring-0 ${
        props.hasError
          ? "border-red-500 focus:border-red-500"
          : "border-gray-300"
      }`}
      disabled={props.disabled}
    >
      <option value="" className="text-left">
        {props.text}
      </option>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

export default InputDropdownTypeComponent;
