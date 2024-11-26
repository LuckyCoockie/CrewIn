import React from "react";
import crewlistplus from "../../../assets/images/crewlistplus.png";
import ListButtonMolecule from "./ListButtonMolecule";

type GaroScrollProps<T> = {
  propsData: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  replaceText: string;
  plusbutton?: boolean;
  router?: string;
  routerId?: string;
};

const GaroScrollMolecule = <T,>({
  propsData = [],
  renderItem,
  replaceText,
  plusbutton,
  router,
  routerId,
}: GaroScrollProps<T>) => {
  return (
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
      {plusbutton && (
        <ListButtonMolecule
          src={crewlistplus}
          alt="plus"
          text="생성하기"
          router={router}
          routerId={routerId}
        />
      )}
      {propsData.length > 0 ? (
        propsData.map((data, index) => renderItem(data, index))
      ) : (
        <div className="text-gray-300 w-full text-center mt-3">{replaceText}</div>
      )}
    </div>
  );
};

export default GaroScrollMolecule;
