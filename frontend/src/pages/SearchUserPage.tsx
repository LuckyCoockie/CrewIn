import React from "react";
import { ReactComponent as Searchbox } from "../assets/icons/searchbox.svg";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";

const SearchUserPage: React.FC = () => {
  return (
    <div className="flex flex-col max-w-[550px] mx-auto">
      <div className="flex items-center justify-between">
        <BackHeaderMediumOrganism text="" />
        <div className="relative text-gray-600 mt-4 flex-1">
          <input
            className="border-2 border-gray-300 bg-white h-12 px-5 pr-12 rounded-lg text-sm focus:outline-none w-full"
            type="search"
            name="search"
            placeholder="아이디, 이름, 닉네임"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent"
          >
            <Searchbox className="text-gray-600 h-5 w-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchUserPage;
