import React from "react";
import InputLabelComponent from "../atoms/Input/InputLabelComponent";
import InputDateStartComponent from "../atoms/Input/InputDateStartComponent";
import DatePicker from "react-datepicker";

type InputData = {
  id: string;
  title: string;
  selected: Date | null; // Date 타입이 null을 허용하도록 변경
  onChange: (date: Date | null) => void;
};

const InputDateStartTypeMolecule = React.forwardRef<DatePicker, InputData>(
  (props, ref) => {
    return (
      <div className="mb-2">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputDateStartComponent
          id={props.id}
          selected={props.selected}
          onChange={props.onChange}
          ref={ref}
        />
      </div>
    );
  }
);

export default InputDateStartTypeMolecule;
