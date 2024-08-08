import GridListComponent from "../molecules/GridListMolecule";
import SessionListItemMolecules from "../molecules/SessionListItemMolecules";
import { SessionDto } from "../../apis/api/session";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import qs from "query-string";
import { useNavigate } from "react-router";

type OwnProps<T> = {
  fetchData: (props: T) => Promise<SessionDto[]>;
};

const SessionListComponent = <T,>({ fetchData }: OwnProps<T>) => {
  const navigate = useNavigate();
  const query = qs.parse(location.search) as T;

  const { data, isError } = useQuery<
    SessionDto[],
    AxiosError<ErrorResponseDto>
  >([`session`, query], () => fetchData(query), {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isError || !data) return "데이터를 불러오지 못했습니다.";

  return (
    <GridListComponent items={data}>
      {({ item }) => (
        <div onClick={() => navigate(`/session/${item.sessionId}`)}>
          <SessionListItemMolecules
            key={item.sessionId}
            crewName={item.crewName}
            area={item.area}
            date={item.startAt}
            imageUrl={item.sessionThumbnail}
          />
        </div>
      )}
    </GridListComponent>
  );
};

export default SessionListComponent;
