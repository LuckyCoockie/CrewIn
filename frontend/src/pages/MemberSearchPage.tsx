import React, { useState, useEffect } from "react";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";
import {
  getCrewMemberList,
  CrewMemberListResponseDto,
  CrewMemberDto,
} from "../apis/api/crewmemberlist";

const MemberSearchPage: React.FC = () => {
  const [crewId, setCrewId] = useState<number>(1); // set dynamically
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedMembers, setJoinedMembers] = useState<CrewMemberDto[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<CrewMemberDto[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: CrewMemberListResponseDto = await getCrewMemberList(crewId);
        setJoinedMembers(data.crewIsJoinedMemberList);
        setInvitedMembers(data.crewIsInvitedMemberList);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [crewId]);

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="크루원 조회" />
        <div className="flex items-center flex-grow justify-end">
          <Searchicon className="w-6 h-6" />
        </div>
      </header>
      <hr />

      {loading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      <div className="mt-4">
        <h2 className="font-bold text-lg">크루원 목록</h2>
        <h3 className="font-semibold mt-2">가입된 크루원</h3>
        {joinedMembers.length === 0 ? (
          <div className="text-center">가입된 크루원이 없습니다.</div>
        ) : (
          <ul>
            {joinedMembers.map((member) => (
              <li key={member.email} className="flex items-center p-2 border-b">
                <div className="flex-1">
                  <div className="font-bold">{member.name}</div>
                  <div className="text-gray-600">{member.nickname}</div>
                  <div className="text-gray-600">{member.position}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h3 className="font-semibold mt-2">초대된 크루원</h3>
        {invitedMembers.length === 0 ? (
          <div className="text-center">초대된 크루원이 없습니다.</div>
        ) : (
          <ul>
            {invitedMembers.map((member) => (
              <li key={member.email} className="flex items-center p-2 border-b">
                <div className="flex-1">
                  <div className="font-bold">{member.name}</div>
                  <div className="text-gray-600">{member.nickname}</div>
                  <div className="text-gray-600">{member.position}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberSearchPage;
