import React, { useState, useEffect } from "react";
import {
  searchInviteMember,
  SearchInviteMemberResponseDto,
  MemberDto,
} from "../../apis/api/crewinvite";
import { getMyCrews } from "../../apis/api/mycrew";

// 페이지 컴포넌트 정의
const CrewInvitePage: React.FC = () => {
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [crewId, setCrewId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyCrews = async () => {
      try {
        const response = await getMyCrews();
        if (response.crews.length > 0) {
          setCrewId(response.crews[0].crewId); // 현재 크루가 하나만 있다고 가정하고 첫 번째 크루의 ID를 사용
        }
      } catch (error) {
        console.error("크루 목록 조회 오류:", error);
      }
    };

    fetchMyCrews();
  }, []);

  useEffect(() => {
    if (crewId === null) return;

    const fetchMembers = async () => {
      try {
        const response: SearchInviteMemberResponseDto =
          await searchInviteMember({
            crewId,
            query,
          });
        console.log(response.items);
        console.log(response);

        setMembers(response.items);
      } catch (error) {
        console.error("멤버 검색 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [crewId, query]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const renderMemberList = (
    filterFn: (member: MemberDto) => boolean,
    title: string
  ) => (
    <div>
      <h2>{title}</h2>
      <ul>
        {members.filter(filterFn).map((member) => (
          <li key={member.memberId}>
            {member.name} ({member.nickname})
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search members..."
        value={query}
        onChange={handleSearchChange}
      />
      {crewId === null ? (
        <p>Loading crew information...</p>
      ) : (
        <>
          {renderMemberList(
            (member) => member.isJoined === false && member.isInvited === false,
            "초대 가능한 사람"
          )}
          {renderMemberList(
            (member) => member.isJoined === false && member.isInvited === true,
            "초대 중인 사람"
          )}
          {renderMemberList(
            (member) => member.isJoined === true && member.isInvited === true,
            "이미 가입된 사람"
          )}
        </>
      )}
    </div>
  );
};

export default CrewInvitePage;
