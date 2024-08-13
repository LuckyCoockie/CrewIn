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
    <div className="mb-20">
      <header className="px-[12px] md:px-0">
        <div className="flex items-center w-full h-10">
          <LargeTitleMolecule text="전체 크루 목록" />
        </div>
      </header>
      <main className="px-[12px] md:px-0">
        <div className="flex items-center flex-grow justify-end mb-3 xs:mb-5">
          <SearchInputMolecule hint={"크루명"} onSubmit={handleFetchData} />
          <CrewCreateIcon
            className="w-6 h-6 ml-2"
            onClick={handleCrewCreateRoute}
          />
        </div>
        <CrewListComponent fetchData={fetchData} />
      </main>
    </div>
  );
};

export default CrewSearchTemplate;
