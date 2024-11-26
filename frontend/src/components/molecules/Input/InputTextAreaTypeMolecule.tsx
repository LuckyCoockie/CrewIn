import React, { useState, useEffect } from "react";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";
import InputTextAreaTypeComponent from "../../atoms/Input/InputTextAreaTypeComponent";

type InputData = {
  id: string;
  title: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  hasError?: boolean;
};

const InputTextAreaTypeMolecule = React.forwardRef<
  HTMLTextAreaElement,
  InputData
>((props, ref) => {
  const [charCount, setCharCount] = useState(
    props.value ? props.value.length : 0
  );

  useEffect(() => {
    setCharCount(props.value ? props.value.length : 0);
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 255) {
      setCharCount(e.target.value.length);
      props.onChange(e);
    } else {
      e.target.value = e.target.value.slice(0, 255);
      setCharCount(255);
      props.onChange(e);
    }
  };

  return (
    <div className="mb-4">
      <InputLabelComponent id={props.id} title={props.title} />
      <InputTextAreaTypeComponent
        placeholder={props.placeholder}
        id={props.id}
        name={props.name}
        value={props.value}
        ref={ref}
        onChange={handleChange}
        hasError={props.hasError}
      />
      {props.error ? (
        <p className="ps-4 pt-1 text-sm font-light text-red-500">
          {props.error}
        </p>
      ) : (
        <p className="text-reverse text-end">{charCount}/255 글자</p>
      )}
    </div>
  );
});

export default InputTextAreaTypeMolecule;
