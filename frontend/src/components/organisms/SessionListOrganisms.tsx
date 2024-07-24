import React from "react";
import GridListComponent from "../molecules/GridListMolecule";
import InfiniteScrollComponent from "../molecules/InfinityScrollMolecules";
import SessionListItemMolecules from "../molecules/SessionListItemMolecules";
import { SessionDto } from "../../apis/api/session";

type OwnProps = {
  pageSize: number;
  fetchData: (page: number) => Promise<SessionDto[]>;
};

const SessionListComponent: React.FC<OwnProps> = ({ pageSize, fetchData }) => {
  return (
    <InfiniteScrollComponent
      pageSize={pageSize}
      fetchData={fetchData}
      PageComponent={({ data }: { data: SessionDto[] }) => {
        return (
          <GridListComponent items={data}>
            {({ item }) => (
              <SessionListItemMolecules
                key={item.sessionId}
                crewName={item.crewName}
                area={item.area}
                date={item.startAt}
                imageUrl={item.sessionThumbnail}
              />
            )}
          </GridListComponent>
        );
      }}
    ></InfiniteScrollComponent>
  );
};

export default SessionListComponent;
