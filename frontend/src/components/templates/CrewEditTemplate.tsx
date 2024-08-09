import React from "react";
import CrewEditOrganism from "../organisms/CrewEditOrganism";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";

const CrewEditTemplate: React.FC = () => {
  return (
    <>
      <header>
        <BackHeaderMediumOrganism text="크루 수정" />
      </header>
      <main className="flex items-center justify-center">
        <CrewEditOrganism />
      </main>
    </>
  );
};

export default CrewEditTemplate;
