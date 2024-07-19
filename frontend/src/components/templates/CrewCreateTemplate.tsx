import React from "react";
import CrewCreateOrganism from "../organisms/CrewCreateOrganism";
import HeaderOrganism from "../organisms/HeaderOrganism";

const CrewCreateTemplate: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
        <div className="pb-4">
          <HeaderOrganism text="크루 생성" />
        </div>
        <div className="flex items-center justify-center">
          <CrewCreateOrganism />
        </div>
      </div>
    </>
  );
};

export default CrewCreateTemplate;
