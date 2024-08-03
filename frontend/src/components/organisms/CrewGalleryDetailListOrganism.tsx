import React from "react";
import TwoWayInfiniteScrollComponent from "../molecules/TwoWayInfinityScrollMolecules";
import PostItemComponent from "./PostItemOrganism";
import {
  GetCrewGalleryListDetailReqeustParams,
  PostDto,
} from "../../apis/api/crewGallaryList";

type OwnProps = {
  postId: number;
  fetchData: (
    params: GetCrewGalleryListDetailReqeustParams
  ) => Promise<PostDto[]>;
};

const CrewGallaryListDetailComponent: React.FC<OwnProps> = ({
  postId,
  fetchData,
}) => {
  return (
    <TwoWayInfiniteScrollComponent
      fetchKey={["crewGallaryList"]}
      fetchData={fetchData}
      ItemComponent={({ data }) => (
        <PostItemComponent key={data.id} postData={data} />
      )}
      postId={postId}
    />
  );
};

export default CrewGallaryListDetailComponent;
