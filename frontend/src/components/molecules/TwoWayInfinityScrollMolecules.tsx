import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";

type FetchParams = {
  postId: number;
  direction: "increase" | "decrease";
};

export interface ItemComponentProps<T extends { id: number }> {
  data: T;
}

type OwnProps<T extends { id: number }> = {
  postId: number;
  fetchKey: string | string[];
  fetchData: (params: FetchParams) => Promise<T[]>;
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
      },
    }) => fetchData(pageParam),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        if (!lastPage[lastPage.length - 1]) return;
        return {
          postId: lastPage[lastPage.length - 1].id,
          direction: "increase",
        };
      },
      getPreviousPageParam: (firstPage) => {
        if (!firstPage[0]) return;
        return {
          postId: firstPage[0].id,
          direction: "decrease",
        };
      },
    }
  );

  useEffect(() => {
    fetchNextPage();
    fetchPreviousPage();
  }, [fetchNextPage, fetchPreviousPage]);

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

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "instant", block: "center" });
  }, [ref]);

  return (
    <div className={className}>
      {data?.pages.map((data, index) => (
        <React.Fragment key={index}>
          {data?.map((data) => (
            <div ref={data.id == postId ? ref : null}>
              {ItemComponent({ data })}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TwoWayInfiniteScrollComponent;
