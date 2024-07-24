import { CrewDto } from "../../../apis/api/crew";
import CrewListComponent from "../../organisms/CrewListOrganisms";

import { ReactComponent as CrewinLogo } from "../../../assets/icons/crewinlogo.svg";
import { ReactComponent as SearchIcon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewCreateIcon } from "../../../assets/icons/crewCreate.svg";

type OwnProps = {
  fetchData: (page: number) => Promise<CrewDto[]>;
};

const CrewListTemplate: React.FC<OwnProps> = ({ fetchData }: OwnProps) => {
  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <div className="flex items-center bg-white w-full mb-10">
        <div className="flex items-center">
          <CrewinLogo />
        </div>
        <div className="flex items-center flex-grow justify-end mr-2">
          <SearchIcon className="w-6 h-6 mr-4" />
          <CrewCreateIcon className="w-6 h-6" />
        </div>
      </div>
      <CrewListComponent pageSize={6} fetchData={fetchData} />
    </div>
  );
};

export default CrewListTemplate;
