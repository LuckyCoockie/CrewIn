import React from "react";
import CrewListItem from "../molecules/CrewListItemMolecules";
import GridListComponent from "../molecules/GridListMolecule";
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
  pageSize: number;
  fetchData: (page: number) => Promise<CrewData[]>;
};

const CrewListComponent: React.FC<OwnProps> = ({ pageSize, fetchData }) => {
  return (
    <InfiniteScrollComponent
      pageSize={pageSize}
      fetchData={fetchData}
      PageComponent={({ data }: { data: CrewData[] }) => {
        return (
          <GridListComponent items={data}>
            {({ item }) => (
              <CrewListItem
                key={item.id}
                imageUrl={item.imageUrl}
                title={item.name}
                description={item.slogan}
                captain={item.captainName}
                location={item.area}
                peopleCount={item.crewCount}
              />
            )}
          </GridListComponent>
        );
      }}
    ></InfiniteScrollComponent>
  );
};

export default CrewListComponent;
