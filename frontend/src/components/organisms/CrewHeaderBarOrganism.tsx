import React from "react";
import crewlistplus from "../../assets/images/crewlistplus.png";
import RoundButtonMolecule from "../molecules/List/RoundButtonMolecule";
import { CrewDto } from "../../apis/api/mycrew";

type CrewHeaderBarOrganismProps = {
  crewList: CrewDto[];
};

const CrewHeaderBarOrganism: React.FC<CrewHeaderBarOrganismProps> = ({
  crewList,
}) => {
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
        {crewList.length > 0 && (
          <RoundButtonMolecule
            src={crewlistplus}
            alt="plus"
            text="더보기"
            router="/crew/search"
          />
        )}
        {crewList?.map((crew) => {
          return (
            <RoundButtonMolecule
              router="crew/detail"
              routerId={crew.crewId}
              key={crew.crewId}
              src={crew.mainLogo}
              alt={crew.crewName}
              text={crew.crewName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CrewHeaderBarOrganism;
