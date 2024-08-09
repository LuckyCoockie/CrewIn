import React, { useEffect, useRef, useState } from "react";
import PostItemComponent from "./PostItemOrganism";
import { GetCrewGalleryListDetailResponseDto } from "../../apis/api/crewGallaryList";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";

type OwnProps = {
  initPage?: number;
  initPostId?: number;
  fetchData: (pageNo: number) => Promise<GetCrewGalleryListDetailResponseDto>;
};

const CrewGalleryListDetailComponent: React.FC<OwnProps> = ({
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
    ref.current?.scrollIntoView({ behavior: "instant", block: "center" });
  }, [ref, isComponentLoaded]);

  return (
    <div className="w-full">
      <InfiniteScrollComponent
        fetchKey={["crewGallaryDetail"]}
        fetchData={fetchData}
        ItemComponent={({ data }) => (
          <div ref={data.id == initPostId ? ref : null} key={data.id}>
            <PostItemComponent postData={data} />
          </div>
        )}
        initPage={initPage}
      />
    </div>
  );
};

export default CrewGalleryListDetailComponent;
