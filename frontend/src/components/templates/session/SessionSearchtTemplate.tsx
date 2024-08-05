import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg";
import { ReactComponent as RunningIcon } from "../../../assets/icons/running_icon.svg";
import {
  GetSessionListRequestDto,
  SessionStatusType,
  sessionStatusTypeToLabel,
} from "../../../apis/api/session";
import FloatingActionButton from "../../atoms/Button/FloatingActionButton";
import SessionSearchOrganism from "../../organisms/SessionSearchOrganism";
import { useCallback, useState } from "react";

import qs from "query-string";
import DropdownTypeComponent from "../../atoms/Input/DropdownItemComponent";
import SessionListTemplate from "./SessionListTemplate";
import { useNavigate } from "react-router";

type OwnProps = {
  fetchData: (dto: GetSessionListRequestDto) => Promise<void>;
};

const SessionSearchTemplate: React.FC<OwnProps> = ({ fetchData }) => {
  const navigate = useNavigate();

  const query = qs.parse(location.search);

  const [status, setStatus] = useState<SessionStatusType>(
    query.status ?? "active"
  );

  const onSearch = useCallback(
    (data: GetSessionListRequestDto) => fetchData({ status: status, ...data }),
    [fetchData, status]
  );

  const handelStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as SessionStatusType;
      setStatus(value);
      fetchData({ status: value, type: query.sessionType });
    },
    [fetchData, query.sessionType]
  );

  const handleSessionCreateRoute = () => {
    navigate(`/session/create`);
  };

  return (
    <main>
      <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
        <div className="flex items-center bg-white w-full mb-10 h-10">
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
        <SessionSearchOrganism onSearch={onSearch} />
        <SessionListTemplate />
        <FloatingActionButton onClick={handleSessionCreateRoute}>
          <RunningIcon className="w-6 h-6" />
        </FloatingActionButton>
      </div>
    </main>
  );
};

export default SessionSearchTemplate;
