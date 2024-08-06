import React, { useState, useEffect } from "react";
import { ReactComponent as Searchbox } from "../../assets/icons/searchbox.svg";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";
import {
  searchInviteMember,
  SearchInviteMemberResponseDto,
  CrewMemberDto,
} from "../../apis/api/crewinvite";
import { getMyCrews } from "../../apis/api/mycrew";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";

const CrewInvitePage: React.FC = () => {
  const [members, setMembers] = useState<CrewMemberDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [crewId, setCrewId] = useState<number | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const fetchMyCrews = async () => {
      try {
        const response = await getMyCrews();
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId); // 현재 크루가 하나만 있다고 가정하고 첫 번째 크루의 ID를 사용
        }
      } catch (error) {
        console.error("크루 목록 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCrews();
  }, []);

  useEffect(() => {
    if (crewId === null) return;

    const fetchMembers = async () => {
      setSearching(true);
      try {
        const response: SearchInviteMemberResponseDto =
          await searchInviteMember({
            crewId,
            query,
          });
        setMembers(response.items);
      } catch (error) {
        console.error("멤버 검색 오류:", error);
      } finally {
        setSearching(false);
      }
    };

    fetchMembers();
  }, [crewId, query]);

  const handleSearch = () => {
    setShowDropdown(false);
    setSearching(true);
    fetchMembers();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const fetchMembers = async () => {
    if (query.trim() === "") {
      setMembers([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);

    try {
      const response: SearchInviteMemberResponseDto = await searchInviteMember({
        crewId: crewId!,
        query,
      });
      setMembers(response.items);
      setShowDropdown(true);
    } catch (error) {
      console.error("멤버 검색 오류:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const renderMemberList = (
    filterFn: (member: CrewMemberDto) => boolean,
    title: string
  ) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2 ml-4">{title}</h2>
      <ul>
        {members.filter(filterFn).length === 0 ? (
          <div className="text-center">등록된 멤버가 없습니다.</div>
        ) : (
          members.filter(filterFn).map((member) => (
            <li
              key={member.memberId}
              className="flex items-center p-2 border-b"
            >
              <div className="w-12 h-12 flex-shrink-0">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <CrewinLogo className="w-full h-full object-cover rounded-full" />
                )}
              </div>
              <div className="flex-1 ml-3">
                <div className="font-bold">{member.name}</div>
                <div className="text-gray-600">{member.nickname}</div>
              </div>
              <div className="flex gap-2">
                {member.isInvited ? (
                  <button
                    className="border border-gray-400 w-20 h-10 rounded-md text-sm bg-gray-200 cursor-not-allowed"
                    disabled
                  >
                    초대 중
                  </button>
                ) : (
                  <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
                    초대하기
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  if (loading) {
    return <p>Loading crew information...</p>;
  }

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="" />
        <div className="relative flex-1 font-weight-sm">
          <input
            type="search"
            className="h-6 px-4 pr-12 text-md w-full focus:outline-none focus:ring-0 border-none"
            placeholder="이름, 닉네임"
            value={query}
            onChange={handleSearchChange}
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

      {crewId === null ? (
        <p>Loading crew information...</p>
      ) : searching ? (
        <p>Searching members...</p>
      ) : (
        <>
          {renderMemberList(
            (member) =>
              (member.isJoined === false || member.isJoined === null) &&
              (member.isInvited === false || member.isInvited === null),
            "Invitation Allowed"
          )}
          {renderMemberList(
            (member) =>
              (member.isJoined === false || member.isJoined === null) &&
              member.isInvited === true,
            "Invitation in Progress"
          )}
        </>
      )}
    </div>
  );
};

export default CrewInvitePage;
