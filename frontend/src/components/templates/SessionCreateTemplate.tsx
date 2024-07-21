import React from "react";
import HeaderOrganism from "../organisms/HeaderOrganism";
import SessionCreateOrganism from "../organisms/SessionCreateOrganism";

const SessionCreateTemplate: React.FC = () => {
  return (
    <>
      <header className="text-center">
        <HeaderOrganism text="세션 생성" />
      </header>
      <main className="flex items-center justify-center pt-4 pb-20">
        <SessionCreateOrganism />
      </main>
    </>
  );
};

export default SessionCreateTemplate;
