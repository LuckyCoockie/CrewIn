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
};

const InputRadioTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

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
              key={index} // 각 컴포넌트에 고유한 키를 부여합니다.
              id={`${props.id}-${index}`} // 각 InputRadioComponent에 고유한 id를 부여합니다.
              onChange={handleChange}
              name={props.name}
              hasError={props.hasError}
              ref={ref}
              value={value} // value 속성을 전달합니다.
              checked={selectedValue === value}
            />
          ))}
        </div>
      </div>
    );
  }
);
export default InputRadioTypeMolecule;
