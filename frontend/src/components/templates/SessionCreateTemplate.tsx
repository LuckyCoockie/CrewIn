import React from "react";
import HeaderOrganism from "../organisms/HeaderOrganism";
import SessionCreateOrganism from "../organisms/SessionCreateOrganism";

const SessionCreateTemplate: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[550px] pt-4 pb-10">
        <div className="pb-4">
          <HeaderOrganism text="세션 생성" />
        </div>
        <div className="flex items-center justify-center">
          <SessionCreateOrganism />
        </div>
      </div>
    </>
  );
};

export default SessionCreateTemplate;
