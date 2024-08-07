import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { PageNationData } from "../type";

export type ItemComponentProps<T> = {
  data: T;
};

type OwnProps<T> = {
  fetchKey: string | string[];
  fetchData: (page: number) => Promise<PageNationData<T>>;
  ItemComponent: (
    props: ItemComponentProps<T>
  ) => React.ReactElement<HTMLElement>;
  className?: string;
  initPage?: number;
};

const InfiniteScrollComponent = <T,>({
  fetchKey,
  fetchData,
  ItemComponent,
  className,
  initPage,
}: OwnProps<T>) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      fetchKey,
      ({ pageParam = initPage ?? 0 }) => fetchData(pageParam),
      {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => {
          if (lastPage.lastPageNo <= lastPage.pageNo) return;
          const nextPage = lastPage.pageNo + 1;
          return nextPage;
        },
      }
    );

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (
        !isFetchingNextPage &&
        scrollHeight - scrollTop <= clientHeight * 1.2
      ) {
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
      {data?.pages.map((data, index) => (
        <React.Fragment key={index}>
          {data?.items.map((data) => ItemComponent({ data }))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default InfiniteScrollComponent;
