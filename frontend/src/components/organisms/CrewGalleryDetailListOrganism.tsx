import React from "react";
import TwoWayInfiniteScrollComponent from "../molecules/TwoWayInfinityScrollMolecules";
import PostItemComponent from "./PostItemOrganism";
import {
  GetCrewGalleryListDetailReqeustParams,
  PostDto,
} from "../../apis/api/crewPostList";

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
      fetchKey={["CrewPostList"]}
      fetchData={fetchData}
      ItemComponent={({ data }) => (
        <PostItemComponent key={data.id} postData={data} />
      )}
      postId={postId}
    />
  );
};

export default CrewGallaryListDetailComponent;
