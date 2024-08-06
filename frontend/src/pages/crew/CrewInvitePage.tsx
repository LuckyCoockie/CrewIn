import React, { useState, useEffect, useCallback } from "react";
import { ReactComponent as Searchbox } from "../../assets/icons/searchbox.svg";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";
import {
  searchInviteMember,
  SearchInviteMemberResponseDto,
  CrewMemberDto,
} from "../../apis/api/crewinvite";
import { getMyCrews } from "../../apis/api/mycrew";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";
import debounce from "lodash.debounce";
import { fetchAllMembers, MemberDto } from "../../apis/api/usersearch";

const CrewInvitePage: React.FC = () => {
  const [members, setMembers] = useState<CrewMemberDto[]>([]);
  const [allUsers, setAllUsers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [crewId, setCrewId] = useState<number | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const fetchMyCrews = async () => {
      try {
        const response = await getMyCrews();
        console.log("My Crews Response:", response); // 응답 로그 추가
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId);
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
        console.log("Search Invite Member Response:", response); // 응답 로그 추가
        setMembers(response.items);
      } catch (error) {
        console.error("멤버 검색 오류:", error);
      } finally {
        setSearching(false);
      }
    };

    fetchMembers();
  }, [crewId, query]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setSearching(true);
      try {
        const allUsersResponse = await fetchAllMembers();
        console.log("All Users Response:", allUsersResponse); // 응답 로그 추가
        setAllUsers(allUsersResponse);
      } catch (error) {
        console.error("유저 검색 오류:", error);
      } finally {
        setSearching(false);
      }
    };

    fetchAllUsers();
  }, []);

  const debouncedFetchMembers = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === "") {
        setMembers([]);
        setAllUsers([]);
        setShowDropdown(false);
        return;
      }

      setSearching(true);

      try {
        const response: SearchInviteMemberResponseDto =
          await searchInviteMember({
            crewId: crewId!,
            query,
          });
        setMembers(response.items);

        const allUsersResponse = await fetchAllMembers();
        setAllUsers(allUsersResponse);

        setShowDropdown(true);
      } catch (error) {
        console.error("멤버 검색 오류:", error);
      } finally {
        setSearching(false);
      }
    }, 300),
    [crewId]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedFetchMembers(event.target.value);
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

  const renderUserList = (title: string) => {
    // 검색어가 있는 경우, 검색어에 맞게 필터링
    const filteredUsers =
      query.trim() === ""
        ? allUsers
        : allUsers.filter(
            (user) =>
              user.memberName.toLowerCase().includes(query.toLowerCase()) ||
              user.memberNickName.toLowerCase().includes(query.toLowerCase())
          );

    // 이미 초대되었거나 초대 진행 중인 멤버 ID를 추출
    const invitedAndAllowedMemberIds = members.map((member) => member.memberId);

    // 초대되었거나 초대 진행 중이지 않은 사용자만 필터링
    const finalFilteredUsers = filteredUsers.filter(
      (user) => !invitedAndAllowedMemberIds.includes(user.memberId)
    );

    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 ml-4">{title}</h2>
        <ul>
          {finalFilteredUsers.length === 0 ? (
            <div className="text-center">등록된 유저가 없습니다.</div>
          ) : (
            finalFilteredUsers.map((user) => (
              <li
                key={user.memberId}
                className="flex items-center p-2 border-b"
              >
                <div className="w-12 h-12 flex-shrink-0">
                  {user.profileUrl ? (
                    <img
                      src={user.profileUrl}
                      alt={user.memberName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <CrewinLogo className="w-full h-full object-cover rounded-full" />
                  )}
                </div>
                <div className="flex-1 ml-3">
                  <div className="font-bold">{user.memberName}</div>
                  <div className="text-gray-600">{user.memberNickName}</div>
                </div>
                <div className="flex gap-2">
                  <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
                    초대하기
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  };

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
          {renderUserList("All Users")}
        </>
      )}
    </div>
  );
};

export default CrewInvitePage;
