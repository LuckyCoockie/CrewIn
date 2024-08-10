import React from "react";
import MediumTitleMolecule from "../../molecules/Title/MediumTitleMolecule";
import { MyMapsDto } from "../../../apis/api/mypage";
import GaroScrollMolecule from "../../molecules/List/GaroScrollMolecule";
import ListButtonMolecule from "../../molecules/List/ListButtonMolecule";
import SpinnerComponent from "../../atoms/SpinnerComponent";
import ErrorText from "../../atoms/ErrorText";

type FetchDataProps = {
  mapsData: MyMapsDto[];
  isMapsLoading: boolean;
  isMapsError: boolean;
};

const MyPageMapOrganism: React.FC<FetchDataProps> = ({
  mapsData,
  isMapsLoading,
  isMapsError,
}) => {
  return (
    <>
      <div className="flex">
        <MediumTitleMolecule text="지도 목록" />
      </div>
      {!isMapsError ? (
        !isMapsLoading && (
          <GaroScrollMolecule
            router="course"
            routerId="create"
            plusbutton={true}
            replaceText=""
            propsData={mapsData}
            renderItem={(data: MyMapsDto, index: number) => (
              <ListButtonMolecule
                key={index}
                src={data.thumbnailImage}
                alt={data.name}
                text={data.name}
                router="course"
                routerId={data.id}
              />
            )}
          />
        )
      ) : (
        <ErrorText text="예기치 못한 오류가 발생했습니다." />
      )}
      {isMapsLoading && <SpinnerComponent />}
    </>
  );
};

export default MyPageMapOrganism;
