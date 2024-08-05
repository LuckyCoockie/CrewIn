import { useCallback } from "react";
import CrewSearchTemplate from "../../components/templates/crew/CrewSearchTemplate";
import { GetCrewListRequestDto } from "../../apis/api/crewlist";
import { createSearchParams, useNavigate } from "react-router-dom";

const CrewSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (dto: GetCrewListRequestDto) => {
      navigate(`/crew?${createSearchParams(dto)}`);
    },
    [navigate]
  );

  return (
    <main>
      <CrewSearchTemplate fetchData={fetchData} />
    </main>
  );
};

export default CrewSearchPage;
