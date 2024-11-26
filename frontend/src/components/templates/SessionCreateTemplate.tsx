import React from "react";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionCreateOrganism from "../organisms/SessionCreateOrganism";

const SessionCreateTemplate: React.FC = () => {
  return (
    <>
      <header className="text-center">
        <BackHeaderMediumOrganism text="세션 생성" />
      </header>
      <main className="flex items-center justify-center">
        <SessionCreateOrganism />
      </main>
    </>
  );
};

export default SessionCreateTemplate;
