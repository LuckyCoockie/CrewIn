import React from "react";
import InputLabelComponent from "../../atoms/Input/InputLabelComponent";
import InputDateEndComponent from "../../atoms/Input/InputDateEndComponent";
import DatePicker from "react-datepicker";

type InputData = {
  id: string;
  title: string;
  selected: Date | null; // Date 타입이 null을 허용하도록 변경
  onChange: (date: Date | null) => void;
  minDate?: Date | null; // 최소 날짜를 받을 수 있도록 변경
};

const InputDateEndTypeMolecule = React.forwardRef<DatePicker, InputData>(
  (props, ref) => {
    return (
      <div className="mb-4">
        <InputLabelComponent id={props.id} title={props.title} />
        <InputDateEndComponent
          id={props.id}
          selected={props.selected}
          onChange={props.onChange}
          ref={ref}
          minDate={props.minDate}
        />
      </div>
    );
  }
);

export default InputDateEndTypeMolecule;
