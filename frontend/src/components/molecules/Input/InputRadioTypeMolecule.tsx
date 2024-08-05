import React, { useState, useEffect } from "react";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";
import InputRadioComponent from "../../atoms/Input/InputRadioComponent";

type InputData = {
  id: string;
  title: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: boolean;
  value: string[];
  default: string;
  selectedValue?: string; // 선택 속성 추가
  disabledOptions?: string[]; // disabled 속성 추가
};

const InputRadioTypeMolecule = React.forwardRef<HTMLInputElement, InputData>(
  (props, ref) => {
    const [internalSelectedValue, setInternalSelectedValue] = useState<string>(
      props.default
    );

    useEffect(() => {
      if (props.selectedValue !== undefined) {
        setInternalSelectedValue(props.selectedValue);
      }
    }, [props.selectedValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalSelectedValue(e.target.value);
      props.onChange(e);
    };

    return (
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <div className="flex space-x-1">
          {props.value.map((value, index) => (
            <InputRadioComponent
              key={index}
              id={`${props.id}-${index}`}
              onChange={handleChange}
              name={props.name}
              hasError={props.hasError}
              ref={ref}
              value={value}
              checked={internalSelectedValue === value}
              disabled={props.disabledOptions?.includes(value)}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default InputRadioTypeMolecule;
