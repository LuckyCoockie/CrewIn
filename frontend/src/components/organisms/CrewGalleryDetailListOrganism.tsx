import React from "react";
import PostItemComponent from "./PostItemOrganism";
import { GetCrewGalleryListDetailResponseDto } from "../../apis/api/crewGallaryList";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";

type OwnProps = {
  initPage: number;
  fetchData: (pageNo: number) => Promise<GetCrewGalleryListDetailResponseDto>;
};

const CrewGalleryListDetailComponent: React.FC<OwnProps> = ({
  initPage,
  fetchData,
}) => {
  return (
    <InfiniteScrollComponent
      fetchKey={["crewGallaryDetail"]}
      fetchData={fetchData}
      ItemComponent={({ data }) => (
        <PostItemComponent key={data.id} postData={data} />
      )}
      initPage={initPage}
    />
  );
};

export default CrewGalleryListDetailComponent;
