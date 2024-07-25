import React from "react";

type Option = {
  label: string;
  value: string | number;
};

type InputData = {
  id: string;
  options: Option[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  hasError?: boolean;
  disabled?: boolean;
};

const DropdownTypeComponent = React.forwardRef<HTMLSelectElement, InputData>(
  (props, ref) => {
    return (
      <select
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        ref={ref}
        className={`border rounded-md text-white bg-primary focus:ring-0 text-xs xs:text-sm ${
          props.hasError
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300"
        }`}
        disabled={props.disabled}
      >
        {props.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-center text-black bg-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

export default DropdownTypeComponent;
