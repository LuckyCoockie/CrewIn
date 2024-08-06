import { ReactComponent as CrewCreateIcon } from "../../../assets/icons/crewCreate.svg";
import {
  GetCrewListRequestDto,
  GetCrewListResponseDto,
} from "../../../apis/api/crewlist";
import LargeTitleMolecule from "../../molecules/Title/LargeTitleMolecule";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import SearchInputMolecule from "../../molecules/Input/SearchInputMolecule";
import CrewListComponent from "../../organisms/CrewListOrganisms";

type OwnProps = {
  onSearch: (dto: GetCrewListRequestDto) => Promise<void>;
  fetchData: (dto: GetCrewListRequestDto) => Promise<GetCrewListResponseDto>;
};

const CrewSearchTemplate: React.FC<OwnProps> = ({
  onSearch,
  fetchData,
}: OwnProps) => {
  const navigate = useNavigate();

  const handleFetchData = useCallback(
    (input?: string) => {
      const dto = { pageNo: "0", query: input ?? "" };
      onSearch(dto);
    },
    [onSearch]
  );

  const handleCrewCreateRoute = () => {
    navigate(`/crew/create`);
  };

  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <div className="flex items-center bg-white w-full mb-5 xs:mb-10">
        <div className="flex items-center">
          {/*TODO : 작아지면 2줄되는 문제 해결 */}
          <LargeTitleMolecule text="전체 크루 목록" />
        </div>
        <div className="flex items-center flex-grow justify-end ml-4">
          <SearchInputMolecule hint={"크루명"} onSubmit={handleFetchData} />
          <CrewCreateIcon
            className="w-6 h-6 ml-2"
            onClick={handleCrewCreateRoute}
          />
        </div>
      </div>
      <CrewListComponent fetchData={fetchData} />
    </div>
  );
};

export default CrewSearchTemplate;
