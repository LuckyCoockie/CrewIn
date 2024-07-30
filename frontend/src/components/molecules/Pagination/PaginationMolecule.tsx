import React from "react";

type List = {
  total: number;
  page: number;
  btn: number;
  setPage: (page: number) => void;
};

const PaginationMolecule: React.FC<List> = ({ total, page, btn, setPage }) => {
  const currentSet = Math.ceil(page / btn);
  const startPage = (currentSet - 1) * btn + 1;
  const totalSet = Math.ceil(total / btn);
  const endPage = Math.min(startPage + btn - 1, total);

  return (
    <nav className="flex justify-center mt-5">
      {currentSet > 1 && (
        <button
          onClick={() => setPage(startPage - 1)}
          className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2"
        >
          {"이전"}
        </button>
      )}
      {Array(btn)
        .fill(startPage)
        .map((_, i) => {
          const pageIndex = startPage + i;
          if (pageIndex > total) return null;
          return (
            <button
              key={i}
              onClick={() => setPage(pageIndex)}
              className={`text-sm leading-none cursor-pointer pt-3 mr-4 ${
                page === pageIndex
                  ? "text-indigo-700 border-indigo-400 font-bold underline"
                  : "text-gray-600 hover:text-indigo-700 border-transparent hover:border-indigo-400"
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
      {totalSet > currentSet && (
        <button
          onClick={() => setPage(endPage + 1)}
          className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2"
        >
          {"다음"}
        </button>
      )}
    </nav>
  );
};

export default PaginationMolecule;
