import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg";
import { ReactComponent as Plus } from "../../../assets/icons/plus.svg";
import {
  GetSessionListRequestDto,
  SessionDto,
  SessionStatusType,
  sessionStatusTypeToLabel,
} from "../../../apis/api/session";
import FloatingActionButton from "../../atoms/Button/FloatingActionButton";
import SessionSearchOrganism from "../../organisms/SessionSearchOrganism";
import { useCallback, useState } from "react";

import qs from "query-string";
import DropdownTypeComponent from "../../atoms/Input/DropdownItemComponent";
import { useNavigate } from "react-router";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../../util/paging/type";
import SessionListItemMolecules from "../../molecules/SessionListItemMolecules";

type OwnProps = {
  onSearch: (dto: GetSessionListRequestDto) => Promise<void>;
  onSessionItemClick: (sessionId: number) => Promise<void>;
  fetchData: (
    dto: GetSessionListRequestDto
  ) => Promise<PageNationData<SessionDto>>;
};

const SessionSearchTemplate: React.FC<OwnProps> = ({
  onSearch,
  onSessionItemClick,
  fetchData,
}) => {
  const navigate = useNavigate();

  const query = qs.parse(location.search);

  const [status, setStatus] = useState<SessionStatusType>(
    query.status ?? "active"
  );

  const handleSearch = useCallback(
    (data: GetSessionListRequestDto) => onSearch({ status: status, ...data }),
    [onSearch, status]
  );

  const handelStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SessionStatusType;
      setStatus(value);
      onSearch({ status: value, type: query.type });
    },
    [onSearch, query.type]
  );

  const handleSessionCreateRoute = () => {
    navigate(`/session/create`);
  };

  const handleFetchData = useCallback(
    (pageNo: number) => {
      return fetchData({ ...query, pageNo: pageNo });
    },
    [fetchData, query]
  );

  return (
    <main>
      <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
        <div className="flex items-center bg-white w-full mb-5 xs:mb-10 h-10">
          <p className="text-xl font-bold pr-1">
            <DropdownTypeComponent
              id={""}
              options={Object.values(SessionStatusType).map((type) => ({
                label: sessionStatusTypeToLabel(type),
                value: type,
              }))}
              value={status}
              onChange={handelStatusChange}
              className="text-xl font-black tracking-tighter p-0 text-left"
            ></DropdownTypeComponent>
          </p>
          <div className="flex items-center">
            <InfoIcon />
          </div>
        </div>
        <SessionSearchOrganism onSearch={handleSearch} />
        <InfiniteScrollComponent
          className="grid grid-cols-2 gap-2 xs:gap-4 mb-2 xs:mb-4 w-full"
          fetchKey={["session", query]}
          fetchData={handleFetchData}
          initPage={parseInt(query.pageNo ?? "0")}
          ItemComponent={({ data }) => (
            <div onClick={() => onSessionItemClick(data.sessionId)}>
              <SessionListItemMolecules
                key={data.sessionId}
                crewName={data.crewName}
                area={data.area}
                date={data.startAt}
                imageUrl={data.sessionThumbnail}
              />
            </div>
          )}
        />
        <FloatingActionButton onClick={handleSessionCreateRoute}>
          <Plus />
        </FloatingActionButton>
      </div>
    </main>
  );
};

export default SessionSearchTemplate;
