import React from "react";
import InputLabelComponent from "../atoms/InputLabelComponent";
import InputDateComponent from "../atoms/InputDateComponent";
import DatePicker from "react-datepicker";

type InputData = {
  id: string;
  title: string;
  selected: Date | null; // Date 타입이 null을 허용하도록 변경
  onChange: (date: Date | null) => void;
};

const InputDateTypeMolecule = React.forwardRef<DatePicker, InputData>(
  (props, ref) => {
    return (
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputDateComponent
          id={props.id}
          selected={props.selected}
          onChange={props.onChange}
          ref={ref}
        />
      </div>
    );
  }
);

export default InputDateTypeMolecule;
