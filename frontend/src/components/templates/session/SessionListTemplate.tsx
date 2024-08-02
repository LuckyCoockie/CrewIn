import { ReactComponent as SearchIcon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewCreateIcon } from "../../../assets/icons/calender.svg";
import SessionListComponent from "../../organisms/SessionListOrganisms";
import { SessionDto, SessionRequestType } from "../../../apis/api/session";
import FloatingActionButton from "../../atoms/Button/FloatingActionButton";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import { useNavigate } from "react-router";

type OwnProps = {
  fetchData: (type: SessionRequestType) => Promise<SessionDto[]>;
};

const SessionListTemplate: React.FC<OwnProps> = ({ fetchData }: OwnProps) => {
  const navigate = useNavigate();

  const handleSearchRoute = () => {
    // 여기에 돋보기 눌렀을 때 들어갈 경로 Router
  };
  const handleSessionCreateRoute = () => {
    navigate(`/session/create`);
  };
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
      <div className="flex items-center bg-white w-full mb-10">
        <div className="flex items-center">
          <LargeTitleMolecule text="진행중인 세션 조회" />
        </div>
        <div className="flex items-center flex-grow justify-end mr-2">
          <SearchIcon className="w-6 h-6 mr-4" onClick={handleSearchRoute} />
          <CrewCreateIcon
            className="w-6 h-6"
            onClick={handleSessionCreateRoute}
          />
        </div>
      </div>
      <SessionListComponent pageSize={6} fetchData={fetchData} />
      <FloatingActionButton />
    </div>
  );
};

export default SessionListTemplate;
