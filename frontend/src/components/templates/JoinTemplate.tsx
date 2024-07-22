import React from "react";
import JoinOrganism from "../organisms/JoinOrganism";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";

const JoinTemplate: React.FC = () => {
  return (
    <>
      <header className="text-center">
        <BackHeaderMediumOrganism text="회원가입" />
      </header>
      <main className="flex items-center justify-center pt-4">
        <JoinOrganism />
      </main>
    </>
  );
};

export default JoinTemplate;
