import React from "react";
import { useQuery } from "react-query";
import ListButtonmolecule from "../molecules/List/ListButtonmolecule";
import crewlistplus from "../../assets/images/crewlistplus.png";
import { getMyCrews, CrewDto } from "../../apis/api/mycrew";

// React Query로 데이터를 fetch하는 함수
const fetchMyCrews = async () => {
  const response = await getMyCrews();
  console.log(response);
  return response;
};

const CrewHeaderBarOrganism: React.FC = () => {
  const {
    data: crewList,
    error,
    isLoading,
  } = useQuery<CrewDto[]>("crews", fetchMyCrews);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>크루 목록을 불러오는 데 실패했습니다.</div>;
  }

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
        <ListButtonmolecule src={crewlistplus} alt="plus" text="더보기" />
        {crewList?.map((crew) => {
          return (
            <ListButtonmolecule
              key={crew.crewId}
              src={crew.imageUrl}
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
