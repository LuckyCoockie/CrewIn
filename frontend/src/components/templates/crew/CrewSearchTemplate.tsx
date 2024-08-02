import { ReactComponent as CrewCreateIcon } from "../../../assets/icons/crewCreate.svg";
import { GetCrewListRequestDto } from "../../../apis/api/crewlist";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import SearchInputMolecule from "../../molecules/Input/SearchInputMolecule";
import CrewListTemplate from "./CrewListTemplate";

type OwnProps = {
  fetchData: (dto: GetCrewListRequestDto) => Promise<void>;
};

const CrewSearchTemplate: React.FC<OwnProps> = ({ fetchData }: OwnProps) => {
  const navigate = useNavigate();

  const handleFetchData = useCallback(
    (input?: string) => {
      const dto = { pageNo: "0", query: input ?? "" };
      fetchData(dto);
    },
    [fetchData]
  );

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
          <SearchInputMolecule hint={"크루명"} onSubmit={handleFetchData} />
          <CrewCreateIcon className="w-6 h-6" onClick={handleCrewCreateRoute} />
        </div>
      </div>
      <CrewListTemplate />
    </div>
  );
};

export default CrewSearchTemplate;
