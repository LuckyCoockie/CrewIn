import React, { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { useInfiniteQuery } from "react-query";

export interface ItemComponentProps<T> {
  data: T[];
}

type OwnProps<T> = {
  key?: string;
  pageSize: number;
  fetchData: (page: number) => Promise<T[]>;
  PageComponent: (
    props: ItemComponentProps<T>
  ) => React.ReactElement<HTMLElement>;
};

const InfiniteScrollComponent = <T,>({
  key = "??",
  fetchData,
  PageComponent,
}: OwnProps<T>) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(key, ({ pageParam = 1 }) => fetchData(pageParam), {
      getNextPageParam: (_, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage;
      },
    });

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
    <div>
      {data?.pages.map((data, index) => (
        <PageComponent key={index} data={data} />
      ))}
      <div className="items-center">{isFetchingNextPage && <Spinner />}</div>
    </div>
  );
};

export default InfiniteScrollComponent;
