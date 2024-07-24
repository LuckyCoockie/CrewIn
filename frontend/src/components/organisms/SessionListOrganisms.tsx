import React, { useCallback, useState } from "react";
import GridListComponent from "../molecules/GridListMolecule";
import SessionListItemMolecules from "../molecules/SessionListItemMolecules";
import {
  SessionDto,
  SessionRequestType,
  SessionRequestTypeData,
  sessionRequestTypeToLabel,
} from "../../apis/api/session";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import DropdownTypeComponent from "../atoms/Input/DropdownItemComponent";

type OwnProps = {
  pageSize: number;
  fetchData: (type: SessionRequestType) => Promise<SessionDto[]>;
};

const SessionListComponent: React.FC<OwnProps> = ({ fetchData }) => {
  const [type, setType] = useState<SessionRequestType>("all");
  const handelTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SessionRequestType;
      return setType(value);
    },
    []
  );

  const { data, isError } = useQuery<
    SessionDto[],
    AxiosError<ErrorResponseDto>
  >({
    queryKey: ["SessionList"],
    queryFn: () => fetchData(type),
  });

  return (
    <div>
      <div className="mb-3 xs:mb-5">
        <DropdownTypeComponent
          id="sessionpaceminutes"
          options={Object.values(SessionRequestTypeData).map((type) => ({
            label: sessionRequestTypeToLabel(type),
            value: type,
          }))}
          value={type}
          onChange={handelTypeChange}
          hasError={isError}
        />
      </div>
      <GridListComponent items={data ?? []}>
        {({ item }) => (
          <SessionListItemMolecules
            key={item.sessionId}
            crewName={item.crewName}
            area={item.area}
            date={item.startAt}
            imageUrl={item.sessionThumbnail}
          />
        )}
      </GridListComponent>
    </div>
  );
};

export default SessionListComponent;
