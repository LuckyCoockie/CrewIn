import { ReactComponent as SearchIcon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewCreateIcon } from "../../../assets/icons/calender.svg";
import SessionListComponent from "../../organisms/SessionListOrganisms";
import { SessionDto, SessionRequestType } from "../../../apis/api/session";
import FloatingActionButton from "../../atoms/Button/FloatingActionButton";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";

type OwnProps = {
  fetchData: (type: SessionRequestType) => Promise<SessionDto[]>;
};

const SessionListTemplate: React.FC<OwnProps> = ({ fetchData }: OwnProps) => {
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
      <div className="flex items-center bg-white w-full mb-10">
        <div className="flex items-center">
          <LargeTitleMolecule text="진행중인 세션 조회" />
        </div>
        <div className="flex items-center flex-grow justify-end mr-2">
          <SearchIcon className="w-6 h-6 mr-4" />
          <CrewCreateIcon className="w-6 h-6" />
        </div>
      </div>
      <SessionListComponent pageSize={6} fetchData={fetchData} />
      <FloatingActionButton />
    </div>
  );
};

export default SessionListTemplate;
