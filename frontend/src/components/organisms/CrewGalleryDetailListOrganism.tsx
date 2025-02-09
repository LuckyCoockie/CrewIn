import React, { useEffect, useRef, useState } from "react";
import { PostDto } from "../../apis/api/crewGallaryList";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";
import { PageNationData } from "../../util/paging/type";
import PostItemComponent from "../templates/PostItemTemplate";

type OwnProps = {
  initPage?: number;
  initPostId?: number;
  fetchData: (pageNo: number) => Promise<PageNationData<PostDto>>;
};

const PostListComponent: React.FC<OwnProps> = ({
  initPage,
  initPostId,
  fetchData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);

  useEffect(() => {
    // TODO : component가 loading 되었는지 확인하는 방법 추가 필요
    setTimeout(() => {
      setIsComponentLoaded(true);
    }, 200);
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [ref, isComponentLoaded]);

  return (
    <div className="w-full">
      <InfiniteScrollComponent
        fetchKey={["crewGallaryDetail"]}
        fetchData={fetchData}
        ItemComponent={(props) => (
          <div
            ref={props.data.id == initPostId ? ref : null}
            key={props.data.id}
          >
            <PostItemComponent {...props} />
          </div>
        )}
        initPage={initPage}
      />
    </div>
  );
};

export default PostListComponent;
