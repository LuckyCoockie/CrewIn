import React from "react";
import TwoWayInfiniteScrollComponent from "../molecules/TwoWayInfinityScrollMolecules";
import PostItemComponent from "./PostItemOrganism";
import {
  GetCrewGalleryListDetailReqeustParams,
  PostDto,
} from "../../apis/api/crewPostList";

type OwnProps = {
  startPostId: number;
  fetchData: (
    params: GetCrewGalleryListDetailReqeustParams
  ) => Promise<PostDto[]>;
};

const CrewPostListComponent: React.FC<OwnProps> = ({
  startPostId,
  fetchData,
}) => {
  return (
    <TwoWayInfiniteScrollComponent
      fetchKey={["CrewPostList"]}
      fetchData={fetchData}
      ItemComponent={({ data }) => (
        <PostItemComponent key={data.postId} postData={data} />
      )}
      startPostId={startPostId}
    />
  );
};

export default CrewPostListComponent;
