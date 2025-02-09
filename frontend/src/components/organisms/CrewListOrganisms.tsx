import React, { useCallback } from "react";
import CrewListItem from "../molecules/CrewListItemMolecules";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";
import qs from "query-string";
import { CrewDto, GetCrewListRequestDto } from "../../apis/api/crewlist";
import { PageNationData } from "../../util/paging/type";

type OwnProps = {
  fetchData: (dto: GetCrewListRequestDto) => Promise<PageNationData<CrewDto>>;
};

const CrewListComponent: React.FC<OwnProps> = ({ fetchData }) => {
  const query = qs.parse(location.search) as GetCrewListRequestDto;

  const handleFetchData = useCallback(
    (page: number) => {
      return fetchData({ query: query.query ?? "", pageNo: page.toString() });
    },
    [fetchData, query.query]
  );

  return (
    <InfiniteScrollComponent
      className="grid grid-cols-2 gap-2 xs:gap-4 mb-2 xs:mb-4 w-full"
      fetchKey={["CrewList", query.query ?? ""]}
      fetchData={handleFetchData}
      initPage={parseInt(query.pageNo ?? "0")}
      ItemComponent={({ data }) => (
        <CrewListItem
          key={data.crewId}
          crewId={data.crewId}
          mainLogo={data.mainLogo}
          title={data.crewName}
          description={data.slogan}
          captain={data.captainName}
          location={data.area}
          peopleCount={data.crewCount}
        />
      )}
    />
  );
};

export default CrewListComponent;
