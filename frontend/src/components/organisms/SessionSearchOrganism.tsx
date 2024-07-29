import React, { useCallback, useState } from "react";
import {
  GetSessionListRequestDto,
  SessionRequestType,
  SessionRequestTypeData,
  sessionRequestTypeToLabel,
} from "../../apis/api/session";
import DropdownTypeComponent from "../atoms/Input/DropdownItemComponent";
import qs from "query-string";
import SearchInputMolecule from "../molecules/Input/SearchInputMolecule";

type OwnProps = {
  onSearch: (data: GetSessionListRequestDto) => Promise<void>;
};

const SessionSearchComponent: React.FC<OwnProps> = ({ onSearch }) => {
  const query = qs.parse(location.search);

  const [type, setType] = useState<SessionRequestType>(query.type ?? "all");
  const [input, setInput] = useState<string | undefined>(query["crew-name"]);
  const [date, setDate] = useState<string | undefined>(query.date);

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
    setInput(value ? value : undefined);
  }, []);

  const handleDateChange = useCallback(
    (value: Date) => {
      setDate(value.toDateString());
      onSearch({ type: type, "crew-name": input, date: value.toDateString() });
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
      <div className="flex items-center flex-grow justify-end ml-2 xs:ml-4">
        <SearchInputMolecule
          hint={"크루명"}
          onChange={handleInputChange}
          onSubmit={handleSearch}
        />
        <div className="mx-1 xs:mx-2">{/* TODO : add calender */}</div>
      </div>
    </div>
  );
};

export default SessionSearchComponent;
