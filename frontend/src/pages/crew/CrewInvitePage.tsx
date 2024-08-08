import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ReactComponent as Searchbox } from "../../assets/icons/searchbox.svg";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";
import {
  searchInviteMember,
  SearchInviteMemberResponseDto,
  CrewMemberDto,
} from "../../apis/api/crewsearch";
import { getMyCrews } from "../../apis/api/mycrew";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";
import debounce from "lodash.debounce";
import {
  inviteCrewMember,
  CrewInviteRequestDto,
  CrewInviteResponseDto,
} from "../../apis/api/crewinvite";

const CrewInvitePage: React.FC = () => {
  const { crewId } = useParams<{ crewId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  const [members, setMembers] = useState<CrewMemberDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setCrewId] = useState<number | null>(null);
  const [query, setQuery] = useState<string>(initialQuery);
  const [searching, setSearching] = useState<boolean>(false);
  const [, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (!crewId) return;

    const fetchMyCrews = async () => {
      try {
        const response = await getMyCrews();
        console.log("My Crews response data:", response);
        if (response.crews.length > 0 && !crewId) {
          setCrewId(response.crews[0].crewId);
        }
      } catch (error) {
        console.error("크루 목록 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCrews();
  }, [crewId]);

  useEffect(() => {
    if (!crewId) return;

    const fetchMembers = async () => {
      setSearching(true);
      try {
        const response: SearchInviteMemberResponseDto =
          await searchInviteMember({
            crewId: parseInt(crewId, 10),
            query: query.trim() === "" ? "" : query,
          });
        console.log("Search Invite Member response:", response);
        setMembers(response.items);
      } catch (error) {
        console.error("Search Invite Member error:", error);
      } finally {
        setSearching(false);
      }
    };

    fetchMembers();
  }, [crewId, query]);

  const debouncedFetchMembers = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === "") {
        setMembers([]);
        setShowDropdown(false);
        try {
          const response: SearchInviteMemberResponseDto =
            await searchInviteMember({
              crewId: parseInt(crewId!, 10),
              query: "",
            });
          console.log("Debounced Fetch All Members response:", response);
          setMembers(response.items);
          setShowDropdown(true);
        } catch (error) {
          console.error("Fetch all members error:", error);
        } finally {
          setSearching(false);
        }
        return;
      }

      setSearching(true);

      try {
        const response: SearchInviteMemberResponseDto =
          await searchInviteMember({
            crewId: parseInt(crewId!, 10),
            query,
          });
        console.log("Debounced Search Invite Member response:", response);
        setMembers(response.items);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search Invite Member error:", error);
      } finally {
        setSearching(false);
      }
    }, 300),
    [crewId]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    debouncedFetchMembers(newQuery);
  };

  const handleInviteClick = async (member: CrewMemberDto) => {
    if (!crewId) return;

    const inviteDto: CrewInviteRequestDto = {
      memberId: member.memberId,
      crewId: parseInt(crewId, 10),
    };

    console.log("Invite DTO:", inviteDto);

    try {
      const response: CrewInviteResponseDto = await inviteCrewMember(inviteDto);
      console.log("Invite Crew Member response:", response);

      if (response) {
        setMembers((prevMembers) =>
          prevMembers.map((m) =>
            m.memberId === member.memberId ? { ...m, isInvited: true } : m
          )
        );
      }
    } catch (error) {
      console.error("초대 오류:", error);
    }
  };

  const renderMemberList = (
    filterFn: (member: CrewMemberDto) => boolean,
    title: string
  ) => (
    <div className="">
      <h2 className="text-lg font-bold mb-2 ml-4">{title}</h2>
      <ul>
        {members.filter(filterFn).length === 0 ? (
          <div></div>
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
                  <button
                    className="border border-gray-400 w-20 h-10 rounded-md text-sm"
                    onClick={() => handleInviteClick(member)}
                  >
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
          />
          <button
            type="button"
            onClick={() => debouncedFetchMembers(query)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent"
          >
            <Searchbox className="text-gray-600 h-5 w-5 fill-current" />
          </button>
        </div>
      </header>

      {crewId === null ? (
        <p>Loading crew information...</p>
      ) : searching ? (
        ""
      ) : (
        <>
          {renderMemberList(
            (member) =>
              (member.isJoined === false || member.isJoined === null) &&
              (member.isInvited === false || member.isInvited === null),
            ""
          )}
          {renderMemberList(
            (member) =>
              (member.isJoined === false || member.isJoined === null) &&
              member.isInvited === true,
            ""
          )}
        </>
      )}
    </div>
  );
};

export default CrewInvitePage;
