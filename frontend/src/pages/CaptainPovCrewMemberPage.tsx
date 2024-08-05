import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackHeaderMediumOrganism from "../components/organisms/BackHeaderMediumOrganism";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";
import {
  getCrewMemberList,
  CrewMemberListResponseDto,
  CrewMemberDto,
} from "../apis/api/crewmemberlist";

const CaptainPovCrewMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [crewId] = useState<number>(1); // 나중에 동적으로 설정
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedMembers, setJoinedMembers] = useState<CrewMemberDto[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<CrewMemberDto[]>([]);
  const [searchQuery] = useState<string>("");

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

  const filteredJoinedMembers = joinedMembers.filter(
    (member) =>
      member.name.includes(searchQuery) || member.nickname.includes(searchQuery)
  );

  const handlePositionChange = (email: string, newPosition: string) => {
    setJoinedMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.email === email ? { ...member, position: newPosition } : member
      )
    );
  };

  const positions = ["CAPTAIN", "PACER", "MEMBER"];

  const onSearchClick = () => {
    navigate("/crew/membersearch/captain"); // 경로로 이동
  };

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="크루원 조회" />
        <div className="relative flex-1 font-weight-sm">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Searchicon
              className="w-5 h-5 text-gray-400"
              onClick={onSearchClick}
            />
          </div>
        </div>
      </header>
      <hr />

      {loading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      <div>
        {filteredJoinedMembers.length === 0 ? (
          <div className="text-center">가입된 크루원이 없습니다.</div>
        ) : (
          <ul>
            {filteredJoinedMembers.map((member) => (
              <li key={member.email} className="flex items-center p-2 border-b">
                <div className="flex-1">
                  <div className="font-bold">{member.name}</div>
                  <div className="text-gray-600">{member.nickname}</div>
                </div>
                <select
                  value={member.position}
                  className="border border-gray-400 w-30 h-10 rounded-md text-sm bg-white"
                  onChange={(e) =>
                    handlePositionChange(member.email, e.target.value)
                  }
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        )}
        {invitedMembers.length === 0 ? (
          <div className="text-center">초대된 크루원이 없습니다.</div>
        ) : (
          <ul>
            {invitedMembers.map((member) => (
              <li key={member.email} className="flex items-center p-2 border-b">
                <div className="flex-1">
                  <div className="font-bold">{member.name}</div>
                  <div className="text-gray-600">{member.nickname}</div>
                </div>
                <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
                  WAITING
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CaptainPovCrewMemberPage;
