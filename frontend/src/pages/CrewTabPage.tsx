import React, { useState } from "react";
import axios from "axios";

// 크루 리스트 출력
interface CrewImage {
  img_url: string;
  type: string;
}
interface CrewDetail {
  details: {
    founded: string;
    members: number;
    activities: string[];
  };
}
interface Crew {
  id: number;
  crew_id: string;
  crew_name: string;
  captin_name: string;
  slogan: string;
  area: string;
  introduction: string;
  crew_img: CrewImage[];
  details: CrewDetail;
}

const CrewTabPage: React.FC = () => {
  const url = "http://localhost:3001/crew";
  const [crewList, setCrewList] = useState<Crew[]>([]);

  const updateCrewList = () => {
    axios
      .get(url)
      .then((res) => {
        setCrewList(res.data);
        console.log("응답완료");
      })
      .catch((err) => {
        console.error("에러 : ", err);
      });
  };

  // 크루 디테일 출력
  const [crewDetail, setCrewDetail] = useState<Crew | null>(null);
  const detailCrewInfo = (crewId: string) => {
    axios
      .get(`http://localhost:3001/crew/detail/${crewId}`)
      .then((res) => {
        setCrewDetail(res.data);
        console.log("랜더링 전", crewDetail);

        console.log("랜더링 후", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      <div>CrewTapPage</div>
      <button onClick={updateCrewList}>전체 리스트 조회</button>
      <ul>
        {crewList.map((crew) => (
          <li key={crew.crew_id}>
            <h2>{crew.crew_name}</h2>
            <p>Captain: {crew.captin_name}</p>
            <p>Slogan: {crew.slogan}</p>
            <p>Area: {crew.area}</p>
            <p>Introduction: {crew.introduction}</p>
            {crew.crew_img.map((img, index) => (
              <div key={index}>
                <img src={img.img_url} alt={`${crew.crew_name} 이미지`} />
                <p>Type: {img.type}</p>
              </div>
            ))}
            <button onClick={() => detailCrewInfo(crew.crew_id)}>Detail</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrewTabPage;
