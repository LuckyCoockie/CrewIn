import React from "react";
import { useQuery } from "react-query";
import {
  getCrewInfo,
  GetCrewInfoRequestDto,
  GetCrewInfoResponseDto,
} from "../apis/api/crewdetail";

const CrewDetailPage: React.FC = () => {
  const crewId = 1;
  // API 호출을 위해 dto 생성
  const crewInfoDto: GetCrewInfoRequestDto = { crewId };

  // useQuery를 사용하여 데이터를 가져옴
  const { data: crewDetailData, isLoading } = useQuery<GetCrewInfoResponseDto>(
    ["getCrewDetail", crewId], // queryKey
    () => getCrewInfo(crewInfoDto) // fetchFn
  );

  // 데이터 로딩 중이면 로딩 메시지 출력
  if (isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  // 에러가 발생하면 에러 메시지 출력

  // 데이터가 로드되었는지 확인하고 콘솔에 출력
  console.log("Crew Detail Data:", crewDetailData);

  return (
    <>
      <div>Data fetched successfully! Check the console for details.</div>
    </>
  );
};

export default CrewDetailPage;
