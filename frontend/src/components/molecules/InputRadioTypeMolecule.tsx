import React, { useState } from "react";
import InputLabelComponent from "../atoms/Input/InputLabelComponent";
import InputRadioComponent from "../atoms/Input/InputRadioComponent";

type InputData = {
  id: string;
  title: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
  value: string[];
  default: string;
};

const InputRadioTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    const [selectedValue, setSelectedValue] = useState<string>(
      `${props.default}`
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(e.target.value);
      props.onChange(e);
    };
    return (
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <div className="flex space-x-4">
          {props.value.map((value, index) => (
            <InputRadioComponent
              key={index}
              id={`${props.id}-${index}`}
              onChange={handleChange}
              name={props.name}
              hasError={props.hasError}
              ref={ref}
              value={value}
              checked={selectedValue === value}
            />
          ))}
        </div>
      </div>
    );
  }
);
export default InputRadioTypeMolecule;
