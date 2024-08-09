import React, { useState, useCallback } from "react";
import { ReactComponent as Searchbox } from "../../assets/icons/searchbox.svg";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import {
  searchMembers,
  UserSearchResponseDto,
  MemberDto,
} from "../../apis/api/usersearch";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";

const SearchUserTemplate: React.FC = () => {
  const [query, setQuery] = useState<string>("");

  const fetchUserData = useCallback(
    async (pageNo: number): Promise<UserSearchResponseDto> => {
      if (query.trim() === "") {
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }

      try {
        return searchMembers({ query, pageNo });
      } catch (error) {
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }
    },
    [query]
  );

  const handleSearch = () => {
    fetchUserData(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="" />
        <div className="relative flex-1 font-weight-sm">
          <input
            className="h-6 px-4 pr-12 text-md w-full focus:outline-none focus:ring-0 border-none"
            type="search"
            placeholder="이름, 닉네임"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent"
          >
            <Searchbox className="text-gray-600 h-5 w-5 fill-current" />
          </button>
        </div>
      </header>
      <hr />

      <div className="mt-4">
        {query.trim() !== "" && (
          <InfiniteScrollComponent
            fetchKey={["userData", query]}
            fetchData={fetchUserData}
            ItemComponent={(props: { data: MemberDto }) => (
              <li
                key={props.data.memberId}
                className="flex items-center p-2 border-b"
              >
                {props.data.profileUrl ? (
                  <img
                    src={props.data.profileUrl}
                    alt={props.data.memberName}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                ) : (
                  <CrewinLogo className="w-10 h-10 rounded-full mr-4" />
                )}
                <div className="flex-1">
                  <div className="font-bold">{props.data.memberName}</div>
                  <div className="text-gray-600">
                    {props.data.memberNickName}
                  </div>
                </div>
              </li>
            )}
            className="user-list"
          />
        )}
      </div>
    </div>
  );
};

export default SearchUserTemplate;
