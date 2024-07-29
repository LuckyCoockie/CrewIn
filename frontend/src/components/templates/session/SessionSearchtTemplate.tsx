import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg";
import { ReactComponent as RunningIcon } from "../../../assets/icons/running_icon.svg";
import { GetSessionListRequestDto } from "../../../apis/api/session";
import FloatingActionButton from "../../atoms/Button/FloatingActionButton";
import { Outlet } from "react-router";
import SessionSearchOrganism from "../../organisms/SessionSearchOrganism";
import { useCallback } from "react";

type OwnProps = {
  fetchData: (dto: GetSessionListRequestDto) => Promise<void>;
};

const SessionSearchTemplate: React.FC<OwnProps> = ({ fetchData }) => {
  const onSearch = useCallback(fetchData, [fetchData]);

  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
      <div className="flex items-center bg-white w-full mb-10">
        <p className="text-xl font-bold pr-1">진행중인 세션</p>
        <div className="flex items-center">
          <InfoIcon />
        </div>
      </div>
      <SessionSearchOrganism onSearch={onSearch} />
      <Outlet />
      <FloatingActionButton>
        <RunningIcon className="w-6 h-6" />
      </FloatingActionButton>
    </div>
  );
};

export default SessionSearchTemplate;
