import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import { MyMapsDto } from "../../../apis/api/mypage";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import crewlistplus from "../../../assets/images/crewlistplus.png";

type FetchDataProps = {
  mapsData: MyMapsDto[];
};

const MyPageMapOrganism: React.FC<FetchDataProps> = ({ mapsData }) => {
  return (
    <>
      <div className="flex">
        <MediumTitleMolecule text="지도 목록" />
      </div>
      <ListButtonMolecule
        src={crewlistplus}
        alt="plus"
        text="추가"
        router="/course"
      />
      <GaroScrollMolecule
        propsData={mapsData}
        renderItem={(data: MyMapsDto, index: number) => (
          <ListButtonMolecule
            key={index}
            src={data.thumbnailImage}
            alt={data.name}
            text={data.name}
          />
        )}
      />
    </>
  );
};

export default MyPageMapOrganism;
