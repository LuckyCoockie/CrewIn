import React from "react";
import CrewCreateOrganism from "../organisms/CrewCreateOrganism";
import HeaderOrganism from "../organisms/HeaderOrganism";

const CrewCreateTemplate: React.FC = () => {
  return (
    <>
      <header className="pb-4">
        <HeaderOrganism text="크루 생성" />
      </header>
      <main className="flex items-center justify-center pb-6">
        <CrewCreateOrganism />
      </main>
    </>
  );
};

export default CrewCreateTemplate;
