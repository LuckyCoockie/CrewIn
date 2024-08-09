import React, { useState, useEffect } from "react";
import { ReactComponent as Searchbox } from "../../assets/icons/searchbox.svg";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import {
  searchMembers,
  UserSearchResponseDto,
} from "../../apis/api/usersearch";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";
import { useNavigate } from "react-router";

const SearchUserTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<UserSearchResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchExecuted, setSearchExecuted] = useState<boolean>(false);

  const fetchResults = async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchMembers({ query: searchQuery });
      setResults(response);
      setShowDropdown(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  const handleSearch = async () => {
    setShowDropdown(false);
    setSearchExecuted(true);
    await fetchResults(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleUserProfile = (memberId: number) => {
    navigate(`/profile/${memberId}`);
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
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onFocus={() => setShowDropdown(true)}
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

      {showDropdown && results && !searchExecuted && (
        <div className="absolute w-full mt-2 border border-gray-300 bg-white shadow-lg z-10 max-h-60 overflow-y-auto top-full">
          {loading ? (
            <div className="text-center p-2">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center p-2">{error}</div>
          ) : results.items.length === 0 ? (
            <div className="text-center p-2">검색 결과가 없습니다.</div>
          ) : (
            <ul>
              {results.items.map((member) => (
                <li
                  key={member.memberId}
                  className="flex items-center p-2 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserProfile(member.memberId)}
                >
                  {member.profileUrl ? (
                    <img
                      src={member.profileUrl}
                      alt={member.memberName}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                  ) : (
                    <CrewinLogo className="w-10 h-10 rounded-full mr-2" />
                  )}
                  <div className="flex-1">
                    <div className="font-bold">{member.memberName}</div>
                    <div className="text-gray-600">{member.memberNickName}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {searchExecuted && results && (
        <div className="mt-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center mt-4">{error}</div>
          ) : results.items.length === 0 ? (
            <div className="text-center">검색 결과가 없습니다.</div>
          ) : (
            <ul>
              {results.items.map((member) => (
                <li
                  key={member.memberId}
                  className="flex items-center p-2 border-b"
                >
                  {member.profileUrl ? (
                    <img
                      src={member.profileUrl}
                      alt={member.memberName}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                  ) : (
                    <CrewinLogo className="w-10 h-10 rounded-full mr-4" />
                  )}
                  <div className="flex-1">
                    <div className="font-bold">{member.memberName}</div>
                    <div className="text-gray-600">{member.memberNickName}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUserTemplate;
