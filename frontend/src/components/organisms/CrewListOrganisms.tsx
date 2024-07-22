import React from "react";
import CrewListItem from "../molecules/CrewListItemMolecules";
import GridListComponent from "../molecules/GridListMolecule";
import InfiniteScrollList from "../molecules/InfinityScrollMolecules";

type CrewData = {
  imageUrl: string;
  title: string;
  description: string;
  captain: string;
  location: string;
  peopleCount: number;
};

type OwnProps = {
  pageSize: number;
  fetchData: (page: number) => Promise<CrewData[]>;
};

const CrewListComponent: React.FC<OwnProps> = ({ pageSize, fetchData }) => {
  return (
    <InfiniteScrollList
      pageSize={pageSize}
      fetchData={fetchData}
      child={({ data }: { data: CrewData[] }) => {
        return (
          <GridListComponent items={data}>
            {({ index, item }) => (
              <CrewListItem
                key={index}
                imageUrl={item.imageUrl}
                title={item.title}
                description={item.description}
                captain={item.captain}
                location={item.location}
                peopleCount={item.peopleCount}
              />
            )}
          </GridListComponent>
        );
      }}
    ></InfiniteScrollList>
  );
};

export default CrewListComponent;
