import React from "react";
import GridListComponent from "../molecules/GridListMolecule";
import SessionListItemMolecules from "../molecules/SessionListItemMolecules";
import { GetSessionListRequestDto, SessionDto } from "../../apis/api/session";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import { removeUndefinedKey } from "../../util/removeUndefinedKey";
import qs from "query-string";

type OwnProps = {
  fetchData: (props: GetSessionListRequestDto) => Promise<SessionDto[]>;
};

const SessionListComponent: React.FC<OwnProps> = ({ fetchData }) => {
  const query = removeUndefinedKey(qs.parse(location.search));

  const { data, isError } = useQuery<
    SessionDto[],
    AxiosError<ErrorResponseDto>
  >({
    queryKey: [`SessionList`, query["crew-name"], query.date, query.type],
    queryFn: () => fetchData(query),
  });

  if (isError) return "데이터를 불러오지 못했습니다.";

  return (
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
  );
};

export default SessionListComponent;
