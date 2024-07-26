import React, { useCallback, useState } from "react";
import {
  GetSessionListRequestDto,
  SessionRequestType,
  SessionRequestTypeData,
  sessionRequestTypeToLabel,
} from "../../apis/api/session";
import DropdownTypeComponent from "../atoms/Input/DropdownItemComponent";
import { ReactComponent as SearchIcon } from "../../assets/icons/searchicon.svg";
import { ReactComponent as CalenderIcon } from "../../assets/icons/calender_icon.svg";
import qs from "query-string";

type OwnProps = {
  onSearch: (data: GetSessionListRequestDto) => Promise<void>;
};

const SessionSearchComponent: React.FC<OwnProps> = ({ onSearch }) => {
  const query = qs.parse(location.search);

  const [type, setType] = useState<SessionRequestType>(query.type ?? "all");
  const [input, setInput] = useState<string>(query["crew-name"]);
  const [date, setDate] = useState<string>(query.date);

  const handleSearch = useCallback(() => {
    onSearch({ type: type, "crew-name": input, date: date });
  }, [date, input, onSearch, type]);

  const handelTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SessionRequestType;
      setType(value);
      onSearch({ type: value, "crew-name": input, date: date });
    },
    [date, input, onSearch]
  );

  // TODO : input, date 입력창 구현
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleDateChange = useCallback(
    (value: string) => {
      setDate(value);
      onSearch({ type: type, "crew-name": input, date: value });
    },
    [input, onSearch, type]
  );

  return (
    <div className="mb-3 xs:mb-5 flex items-center bg-white w-full">
      <DropdownTypeComponent
        id="sessionpaceminutes"
        options={Object.values(SessionRequestTypeData).map((type) => ({
          label: sessionRequestTypeToLabel(type),
          value: type,
        }))}
        value={type}
        onChange={handelTypeChange}
      />
      <div className="flex items-center flex-grow justify-end mr-2">
        <SearchIcon className="w-6 h-6 mr-4" onClick={handleSearch} />
        <CalenderIcon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default SessionSearchComponent;
