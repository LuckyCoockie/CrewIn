import React, { useState } from "react";
import axios from "axios";

interface CrewImage {
  img_url: string;
  type: string;
}

interface Crew {
  crew_id: number;
  crew_name: string;
  captin_name: string;
  slogan: string;
  area: string;
  introduction: string;
  crew_img: CrewImage[];
  id: number;
}
const CrewTapPage: React.FC = () => {
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
  return (
    <div>
      <div>CrewTapPage</div>
      <button onClick={updateCrewList}>DataLoad</button>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrewTapPage;
