import React from "react";
import ListButtonmolecule from "../molecules/List/ListButtonmolecule";
import black from "../../assets/testimage/black.png";
import blue from "../../assets/testimage/blue.png";
import green from "../../assets/testimage/green.png";
import orange from "../../assets/testimage/orange.png";
import purple from "../../assets/testimage/purple.png";
import red from "../../assets/testimage/red.png";
import sky from "../../assets/testimage/sky.png";
import yellow from "../../assets/testimage/yellow.png";
import crewlistplus from "../../assets/images/crewlistplus.png";

const CrewHeaderBarOrganism: React.FC = () => {
  const crewList = [
    { src: black, name: "black" },
    { src: blue, name: "blue" },
    { src: green, name: "green" },
    { src: orange, name: "orange" },
    { src: purple, name: "purple" },
    { src: red, name: "red" },
    { src: sky, name: "sky" },
    { src: yellow, name: "yellow" },
  ];

  return (
    <div>
      <div
        className="whitespace-nowrap overflow-x-auto flex items-center space-x-3"
        style={{
          msOverflowStyle: "none", 
          scrollbarWidth: "none", 
        }}
      >
        {/*횡 스크롤바 삭제 */}
        <style>
          {`
            .whitespace-nowrap::-webkit-scrollbar {
              display: none; /* Chrome, Safari, and Opera */
            }
          `}
        </style>
        <ListButtonmolecule src={crewlistplus} alt="plus" text="더보기" />
        {crewList.map((crew, index) => {
          return (
            <ListButtonmolecule
              key={index}
              src={crew.src}
              alt={crew.name}
              text={crew.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CrewHeaderBarOrganism;
