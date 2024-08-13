import { useCallback } from "react";
import CrewSearchTemplate from "../../components/templates/crew/CrewSearchTemplate";
import { GetCrewListRequestDto, getCrewList } from "../../apis/api/crewlist";
import { createSearchParams, useNavigate } from "react-router-dom";

const CrewSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const onSearch = useCallback(
    async (dto: GetCrewListRequestDto) => {
      navigate(`/crew/search?${createSearchParams(dto)}`);
    },
    [navigate]
  );

  const fetchData = useCallback(async (dto: GetCrewListRequestDto) => {
    return getCrewList(dto);
  }, []);

  return (
      <CrewSearchTemplate onSearch={onSearch} fetchData={fetchData} />
  );
};

export default CrewSearchPage;
