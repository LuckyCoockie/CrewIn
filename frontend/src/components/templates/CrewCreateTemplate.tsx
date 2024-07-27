import React from "react";
import CrewCreateOrganism from "../organisms/CrewCreateOrganism";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";

const CrewCreateTemplate: React.FC = () => {
  return (
    <>
      <header>
        <BackHeaderMediumOrganism text="크루 생성" />
      </header>
      <main className="flex items-center justify-center pt-4 pb-20">
        <CrewCreateOrganism />
      </main>
    </>
  );
};

export default CrewCreateTemplate;
