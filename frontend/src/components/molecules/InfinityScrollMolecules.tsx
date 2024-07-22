import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "flowbite-react";

export interface ItemComponentProps<T> {
  data: T[];
}

type OwnProps<T> = {
  pageSize: number,
  fetchData: (page: number) => Promise<T[]>;
  child: (props: ItemComponentProps<T>) => React.ReactElement<HTMLElement>;
};

const InfiniteScrollList = <T,>({
  pageSize,
  fetchData,
  child: ListComponent,
}: OwnProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const newData = await fetchData(page);
      setData((prevData) => [...prevData, ...newData]);
      setLoading(false);
      if (newData.length < pageSize) {
        setHasMore(false);
      }
    };

    loadData();
  }, [fetchData, page, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (loaderRef.current) {
        const bottom = loaderRef.current.getBoundingClientRect().bottom;
        if (bottom <= window.innerHeight && !loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <ListComponent data={data} />
      <div ref={loaderRef} className="items-center">
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default InfiniteScrollList;
