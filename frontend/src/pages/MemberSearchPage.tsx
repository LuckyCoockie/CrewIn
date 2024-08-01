import React from "react";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";

const MemberSearchPage: React.FC = () => {
  return (
    <main className="p-4">
      <div className="flex flex-col max-w-[550px] mx-auto">
        <div className="flex items-center">
          <div className="flex self-start">
            <BackHeaderMediumOrganism text="크루원 조회" />
            <div className="flex items-center flex-grow justify-end mr-2">
              <Searchicon className="w-6 h-6 mr-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MemberSearchPage;
