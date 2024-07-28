import React from "react";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import FindPasswordOrganism from "../organisms/FindPasswordOrganism";

const FindPasswordTemplate: React.FC = () => {
  return (
    <>
      <header className="text-center">
        <BackHeaderMediumOrganism text="비밀번호 찾기" />
      </header>
      <main className="flex items-center justify-center pt-40">
        <FindPasswordOrganism />
      </main>
    </>
  );
};

export default FindPasswordTemplate;
