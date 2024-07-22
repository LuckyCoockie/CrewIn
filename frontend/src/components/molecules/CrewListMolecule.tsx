import React from "react";
import CrewListItem from "./CrewListItemMolecules";

// 카드 리스트 컴포넌트의 Props 타입 정의
type OwnProps = {
  dataList: {
    imageUrl: string;
    title: string;
    description: string;
    captain: string;
    location: string;
    peopleCount: number;
  }[];
};

// 카드 리스트 컴포넌트 정의
const CrewListComponent: React.FC<OwnProps> = ({ dataList: data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
      {data.map((data, index) => (
        <CrewListItem
          key={index}
          imageUrl={data.imageUrl}
          title={data.title}
          description={data.description}
          captain={data.captain}
          location={data.location}
          peopleCount={data.peopleCount}
        />
      ))}
    </div>
  );
};

export default CrewListComponent;
