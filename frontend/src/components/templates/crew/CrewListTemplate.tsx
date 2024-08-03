import CrewListComponent from "../../organisms/CrewListOrganisms";
import { GetCrewListRequestDto, getCrewList } from "../../../apis/api/crewlist";
import { useCallback } from "react";

const CrewListTemplate: React.FC = () => {
  const fetchData = useCallback(async (dto: GetCrewListRequestDto) => {
    return (await getCrewList(dto)).crews;
  }, []);

  return <CrewListComponent fetchData={fetchData} />;
};

export default CrewListTemplate;
