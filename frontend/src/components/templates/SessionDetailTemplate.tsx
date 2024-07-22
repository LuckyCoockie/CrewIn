import React, { useState } from "react";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import SessionDetailOrganism from "../organisms/SessionDetailOrganism";

const SessionDetailTemplate: React.FC = () => {
  const [name, setName] = useState("");
  return (
    <>
      <header className="py-6">
        <BackHeaderMediumOrganism text={name} />
      </header>
      <div className="pb-20">
        <SessionDetailOrganism setName={setName} />
      </div>
    </>
  );
};

export default SessionDetailTemplate;
