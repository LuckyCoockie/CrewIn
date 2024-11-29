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

const InputTextAreaNoLimitTypeMolecule = React.forwardRef<
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
    if (e.target.value.length <= 1000) {
      setCharCount(e.target.value.length);
      props.onChange(e);
    } else {
      e.target.value = e.target.value.slice(0, 1000);
      setCharCount(1000);
      props.onChange(e);
    }
  };

  return (
    <div className="mb-2 w-full">
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
        <p className="ps-4 text-sm font-light text-red-500">{props.error}</p>
      ) : (
        <p className="text-sm text-sub text-end">{charCount}/1000 글자</p>
      )}
    </div>
  );
});

export default InputTextAreaNoLimitTypeMolecule;
