import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";

type fetchParams = {
  postId: number;
  direction: "increase" | "decrease";
  offset: number;
};

export interface ItemComponentProps<T extends { id: number }> {
  data: T;
}

type OwnProps<T extends { id: number }> = {
  postId: number;
  fetchKey: string | string[];
  fetchData: (params: fetchParams) => Promise<T[]>;
  ItemComponent: (
    props: ItemComponentProps<T>
  ) => React.ReactElement<HTMLElement>;
  className?: string;
};

const TwoWayInfiniteScrollComponent = <T extends { id: number }>({
  fetchKey,
  postId,
  fetchData,
  ItemComponent,
  className,
}: OwnProps<T>) => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery(
    fetchKey,
    ({
      pageParam = {
        postId: postId,
        direction: "decrease",
        offset: 5,
      },
    }) => fetchData(pageParam),
    {
      getNextPageParam: (lastPage) => {
        // 데이터가 없을때 문제가 생기는 중...
        return {
          postId: lastPage[lastPage.length - 1].id,
          direction: "increase",
          offset: 5,
        };
      },
      getPreviousPageParam: (firstPage) => {
        return {
          postId: firstPage[0].id,
          direction: "decrease",
          offset: 5,
        };
      },
    }
  );

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (
        !isFetchingPreviousPage &&
        scrollHeight - scrollTop <= clientHeight * 1.2
      ) {
        if (hasPreviousPage) await fetchPreviousPage();
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage]);

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollTop, clientHeight } = document.documentElement;
      if (!isFetchingNextPage && scrollTop <= clientHeight * 0.2) {
        if (hasNextPage) await fetchNextPage();
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className={className}>
      {data?.pages.map((data) => (
        <>{data?.map((data) => ItemComponent({ data }))}</>
      ))}
    </div>
  );
};

export default TwoWayInfiniteScrollComponent;
