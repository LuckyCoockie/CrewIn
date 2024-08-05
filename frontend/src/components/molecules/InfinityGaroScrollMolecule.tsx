import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";

export interface ItemComponentProps<T> {
  data: T;
}

type OwnProps<T> = {
  fetchKey: string | string[];
  fetchData: (page: number) => Promise<T[]>;
  ItemComponent: (
    props: ItemComponentProps<T>
  ) => React.ReactElement<HTMLElement>;
  className?: string;
  pageSize: number;
  initPage?: number;
};

const InfinityGaroScrollMolecule = <T,>({
  fetchKey,
  fetchData,
  ItemComponent,
  className,
  pageSize,
  initPage,
}: OwnProps<T>) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      fetchKey,
      ({ pageParam = initPage ?? 1 }) => fetchData(pageParam),
      {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.length < pageSize) return undefined;
          return allPages.length + 1;
        },
      }
    );

  useEffect(() => {
    const handleScroll = async () => {
      if (!scrollContainerRef.current) return;
      const { scrollWidth, scrollLeft, clientWidth } = scrollContainerRef.current;
      if (
        !isFetchingNextPage &&
        scrollWidth - scrollLeft <= clientWidth * 1.2
      ) {
        if (hasNextPage) await fetchNextPage();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div ref={scrollContainerRef} className={className}>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.map((item, itemIndex) => (
            <ItemComponent key={itemIndex} data={item} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default InfinityGaroScrollMolecule;
