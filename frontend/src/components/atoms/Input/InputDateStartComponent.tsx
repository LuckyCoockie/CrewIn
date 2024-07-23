import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../../../styles/datepicker.css";
import { addDays } from "date-fns";

type InputDate = {
  id: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
};

const InputDateStartComponent = React.forwardRef<DatePicker, InputDate>(
  (props, ref) => {
    const [startDate, setStartDate] = useState<Date | null>(props.selected);

    useEffect(() => {
      setStartDate(props.selected);
    }, [props.selected]);

    const handleChange = (date: Date | null) => {
      setStartDate(date);
      props.onChange(date);
    };

    return (
      <DatePicker
        locale={ko}
        selected={startDate}
        onChange={handleChange}
        timeInputLabel="Time:"
        dateFormat="MM/dd aa hh:mm"
        showTimeInput
        className="custom-datepicker focus:ring-0" // DatePicker 전체에 적용할 클래스
        calendarClassName="custom-calendar" // Calendar에 적용할 클래스
        wrapperClassName="custom-wrapper" // DatePicker wrapper에 적용할 클래스
        popperClassName="custom-popper" // Popper에 적용할 클래스
        minDate={addDays(new Date(), 0)}
        maxDate={addDays(new Date(), 30)}
        ref={ref}
        withPortal
        portalId="root-portal"
      />
    );
  }
);

export default InputDateStartComponent;
