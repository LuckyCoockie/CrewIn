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
    isFetching,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteQuery(
    fetchKey,
    ({ pageParam = initPage ?? 0 }) => fetchData(pageParam),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        if (lastPage.pageNo >= lastPage.lastPageNo) return;
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
      if (!isFetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        if (hasNextPage) fetchNextPage();
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollTop } = document.documentElement;
      if (!isFetching && scrollTop <= 0) {
        console.log("TOP")
        if (hasPreviousPage) fetchPreviousPage();
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchPreviousPage, hasPreviousPage, isFetching]);

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
