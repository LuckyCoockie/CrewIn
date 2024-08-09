import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { PageNationData } from "../type";

export type ItemComponentProps<T> = {
  pageNo: number;
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
    ({ pageParam = initPage ?? 0 }) => fetchData(pageParam),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        if (lastPage.pageNo <= lastPage.lastPageNo) return;
        const nextPage = lastPage.pageNo + 1;
        return nextPage;
      },
      getPreviousPageParam: (firstPage) => {
        if (firstPage.pageNo <= 0) return;
        const previousPage = firstPage.pageNo - 1;
        return previousPage;
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

  return (
    <div className={className}>
      {data?.pages.map((page) => (
        <React.Fragment key={page.pageNo}>
          {page?.items.map((data) =>
            ItemComponent({ pageNo: page.pageNo, data: data })
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default InfiniteScrollComponent;
