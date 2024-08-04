import React, { useCallback, useState } from "react";
import {
  GetSessionListRequestDto,
  SessionType,
  sessionTypeToLabel,
} from "../../apis/api/session";
import DropdownTypeComponent from "../atoms/Input/DropdownItemComponent";
import qs from "query-string";
import SearchInputMolecule from "../molecules/Input/SearchInputMolecule";
import { ReactComponent as CalenderIcon } from "../../assets/icons/calender_icon.svg";
import { ko } from "date-fns/locale";
import "../../styles/datepicker.css";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";

type OwnProps = {
  onSearch: (data: GetSessionListRequestDto) => Promise<void>;
};

const SessionSearchComponent: React.FC<OwnProps> = ({ onSearch }) => {
  const query = qs.parse(location.search);

  const [type, setType] = useState<SessionType>(query.sessionType);
  const [input, setInput] = useState<string | undefined>(query["crewname"]);
  const [date, setDate] = useState<Date | null>(query.date);

  function formatDate(date: Date | null): string | undefined {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleSearch = useCallback(() => {
    onSearch({ sessionType: type, crewname: input, date: formatDate(date) });
  }, [date, input, onSearch, type]);

  const handelTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SessionType;
      setType(value);
      onSearch({
        sessionType: value,
        crewname: input,
        date: formatDate(date),
      });
    },
    [date, input, onSearch]
  );

  // TODO : input, date 입력창 구현
  const handleInputChange = useCallback((value: string) => {
    setInput(value ? value : undefined);
  }, []);

  const handleDateChange = useCallback(
    (value: Date | null) => {
      setDate(value);
      onSearch({
        sessionType: type,
        crewname: input,
        date: formatDate(value),
      });
    },
    [input, onSearch, type]
  );

  return (
    <>
      <div className="mb-3 xs:mb-5 flex items-center bg-white w-full">
        <DropdownTypeComponent
          id="sessionpaceminutes"
          options={[
            { label: "전체", value: undefined },
            ...Object.values(SessionType).map((type) => ({
              label: sessionTypeToLabel(type),
              value: type,
            })),
          ]}
          value={type}
          onChange={handelTypeChange}
          className="border rounded-md text-white bg-primary"
        />
        <div className="flex items-center flex-grow justify-end ml-2 xs:ml-4">
          <SearchInputMolecule
            hint={"크루명"}
            onChange={handleInputChange}
            onSubmit={handleSearch}
          />
          <div className="ml-2">
            <DatePicker
              locale={ko}
              selected={date}
              onChange={handleDateChange}
              calendarClassName="custom-calendar" // Calendar에 적용할 클래스
              wrapperClassName="custom-wrapper" // DatePicker wrapper에 적용할 클래스
              popperClassName="custom-popper" // Popper에 적용할 클래스
              minDate={addDays(new Date(), 0)}
              maxDate={addDays(new Date(), 30)}
              withPortal
              portalId="root-portal"
              customInput={<CalenderIcon className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionSearchComponent;
