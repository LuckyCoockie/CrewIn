import React from "react";
import CrewCreateOrganism from "../organisms/CrewCreateOrganism";
import HeaderOrganism from "../organisms/HeaderOrganism";

const CrewCreateTemplate: React.FC = () => {
  return (
    <>
      <header className="text-center">
        <HeaderOrganism text="크루 생성" />
      </header>
      <main className="flex items-center justify-center pt-4 pb-20">
        <CrewCreateOrganism />
      </main>
    </>
  );
};

export default CrewCreateTemplate;
