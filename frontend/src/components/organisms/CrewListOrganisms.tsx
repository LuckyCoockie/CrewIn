import React, { useCallback } from "react";
import CrewListItem from "../molecules/CrewListItemMolecules";
import InfiniteScrollComponent from "../molecules/InfinityScrollMolecules";
import qs from "query-string";
import { GetCrewListRequestDto } from "../../apis/api/crewlist";

type CrewData = {
  crewId: number;
  crewName: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  imageUrl: string;
};

type OwnProps = {
  fetchData: (dto: GetCrewListRequestDto) => Promise<CrewData[]>;
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
      pageSize={10}
      initPage={parseInt(query.pageNo ?? "1")}
      ItemComponent={({ data }) => (
        <CrewListItem
          key={data.crewId}
          imageUrl={data.imageUrl}
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
