import CrewListComponent from "../../organisms/CrewListOrganisms";

import { ReactComponent as SearchIcon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewCreateIcon } from "../../../assets/icons/crewCreate.svg";
import { CrewDto } from "../../../apis/api/crewlist";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import EditableText from "../../atoms/EditableText";
import { useNavigate } from "react-router";

type OwnProps = {
  fetchData: (page: number) => Promise<CrewDto[]>;
};

const CrewListTemplate: React.FC<OwnProps> = ({ fetchData }: OwnProps) => {
  const navigate = useNavigate();

  const handleSearchRoute = () => {
    // 여기에 돋보기 눌렀을 때 들어갈 경로 Router
  };
  const handleCrewCreateRoute = () => {
    navigate(`/crew/create`);
  };
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <div className="flex items-center bg-white w-full mb-10">
        <div className="flex items-center">
          <LargeTitleMolecule text="전체 크루 목록" />
        </div>
        <div className="flex items-center flex-grow justify-end mr-2">
          <EditableText>
            <SearchIcon className="w-6 h-6 mr-4" onClick={handleSearchRoute} />
          </EditableText>
          <CrewCreateIcon className="w-6 h-6" onClick={handleCrewCreateRoute} />
        </div>
      </div>
      <CrewListComponent fetchData={fetchData} />
    </div>
  );
};

export default CrewListTemplate;
