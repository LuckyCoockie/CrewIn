import React from "react";
import CrewListComponent from "../components/organisms/CrewListOrganisms";

const CrewPage: React.FC = () => {
  const getCrewListWithPage = async () => {
    return [
      {
        imageUrl: "https://picsum.photos/300",
        title: "Crew In",
        description: "같이의 가치",
        captain: "박준식",
        location: "서울특별시 강남구",
        peopleCount: 5,
      },
      {
        imageUrl: "https://picsum.photos/300",
        title: "Crew In",
        description: "같이의 가치",
        captain: "박준식",
        location: "서울특별시 강남구",
        peopleCount: 5,
      },
      {
        imageUrl: "https://picsum.photos/300",
        title: "Crew In",
        description: "같이의 가치",
        captain: "박준식",
        location: "서울특별시 강남구",
        peopleCount: 5,
      },
      {
        imageUrl: "https://picsum.photos/300",
        title: "Crew In",
        description: "같이의 가치",
        captain: "박준식",
        location: "서울특별시 강남구",
        peopleCount: 5,
      },
      {
        imageUrl: "https://picsum.photos/300",
        title: "Crew In",
        description: "같이의 가치",
        captain: "박준식",
        location: "서울특별시 강남구",
        peopleCount: 5,
      },
      {
        imageUrl: "https://picsum.photos/300",
        title: "Crew In",
        description: "같이의 가치",
        captain: "박준식",
        location: "서울특별시 강남구",
        peopleCount: 5,
      },
    ];
  };

  return <CrewListComponent pageSize={6} fetchData={getCrewListWithPage} />;
};

export default CrewPage;
