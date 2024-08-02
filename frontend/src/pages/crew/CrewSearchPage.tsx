import { useCallback } from "react";
import CrewSearchTemplate from "../../components/templates/crew/CrewSearchTemplate";
import { removeUndefinedKey } from "../../util/removeUndefinedKey";
import { GetCrewListRequestDto } from "../../apis/api/crewlist";
import { createSearchParams, useNavigate } from "react-router-dom";

const CrewSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (dto: GetCrewListRequestDto) => {
      removeUndefinedKey(dto);
      navigate(`/session?${createSearchParams(dto)}`);
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
