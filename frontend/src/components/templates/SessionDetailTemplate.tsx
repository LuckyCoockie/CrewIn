import React from "react";
import HeaderOrganism from "../organisms/HeaderOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";

const SessionDetailTemplate: React.FC = () => {
  return (
    <>
      <header className="text-center">
        <HeaderOrganism text="세션 생성" />
      </header>
      <div className="pb-20">
        <SessionDetailOrganism />
      </div>
    </>
  );
};

export default SessionDetailTemplate;
