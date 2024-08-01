import React from "react";
import CrewListItem from "../molecules/CrewListItemMolecules";
import InfiniteScrollComponent from "../molecules/InfinityScrollMolecules";

type CrewData = {
  id: number;
  name: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  imageUrl: string;
};

type OwnProps = {
  fetchData: (page: number) => Promise<CrewData[]>;
};

const CrewListComponent: React.FC<OwnProps> = ({ fetchData }) => {
  return (
    <InfiniteScrollComponent
      className="grid grid-cols-2 gap-2 xs:gap-4 mb-2 xs:mb-4"
      fetchKey={["CrewList"]}
      fetchData={fetchData}
      pageSize={6}
      ItemComponent={({ data }) => (
        <CrewListItem
          key={data.id}
          imageUrl={data.imageUrl}
          title={data.name}
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
