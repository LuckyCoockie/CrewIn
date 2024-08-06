import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import { ReactComponent as Searchicon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewinLogo } from "../../../assets/icons/crewinlogo.svg";
import {
  getCrewMemberList,
  CrewMemberListResponseDto,
  CrewMemberDto,
} from "../../../apis/api/crewmemberlist";

const CrewMemberSearchTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [crewId] = useState<number>(1); // 나중에 동적으로 설정
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedMembers, setJoinedMembers] = useState<CrewMemberDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: CrewMemberListResponseDto = await getCrewMemberList(crewId);
        setJoinedMembers(data.items.filter((member) => member.joined));
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

    fetchMembers();
  }, [crewId]);

  const filteredMembers = joinedMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchIconClick = () => {
    navigate("/crew/membersearch/captain");
  };

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="" />
        <div className="relative flex-1 font-weight-sm">
          <input
            type="search"
            className="h-6 px-4 pr-12 text-md w-full focus:outline-none focus:ring-0 border-none"
            placeholder="크루원 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Searchicon
              className="w-5 h-5 text-gray-400 cursor-pointer"
              onClick={handleSearchIconClick}
            />
          </div>
        </div>
      </header>
      <hr />

      {loading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      <div>
        {filteredMembers.length === 0 ? (
          <div className="text-center">가입된 크루원이 없습니다.</div>
        ) : (
          <ul>
            {filteredMembers.map((member) => (
              <li key={member.email} className="flex items-center p-2 border-b">
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
                  <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
                    {member.position}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CrewMemberSearchTemplate;
