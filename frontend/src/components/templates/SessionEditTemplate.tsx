import React from "react";
import SessionEditOrganism from "../organisms/SessionEditOrganism";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";

const SessionEditTemplate: React.FC = () => {
  return (
    <>
      <header>
        <BackHeaderMediumOrganism text="세션 수정" />
      </header>
      <main className="flex items-center justify-center">
        <SessionEditOrganism />
      </main>
    </>
  );
};

export default SessionEditTemplate;
