import React from "react";

type GaroScrollProps<T> = {
  propsData: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

const GaroScrollMolecule = <T,>({ propsData, renderItem }: GaroScrollProps<T>) => {
  return (
    <div>
      <div
        className="whitespace-nowrap overflow-x-auto flex items-center space-x-3"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* 횡 스크롤바 삭제 */}
        <style>
          {`
            .whitespace-nowrap::-webkit-scrollbar {
              display: none; /* Chrome, Safari, and Opera */
            }
          `}
        </style>
        {propsData.map((data, index) => renderItem(data, index))}
      </div>
    </div>
  );
};

export default GaroScrollMolecule;
