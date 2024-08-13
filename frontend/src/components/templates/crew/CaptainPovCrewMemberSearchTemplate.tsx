import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import { ReactComponent as Searchicon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewinLogo } from "../../../assets/icons/crewinlogo.svg";
import {
  getCrewMemberList,
  GetCrewMemberListResponseDto,
  CrewMemberDto,
} from "../../../apis/api/crewmemberlist";
import { changeAuthority } from "../../../apis/api/changeauthority";
import { changeCaptain } from "../../../apis/api/captainchange";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";

// Captain - Pacer - Member 순으로 정렬
const sortPositions: Record<string, number> = {
  CAPTAIN: 1,
  PACER: 2,
  MEMBER: 3,
};

const CaptainPovCrewMemberSearchTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [members, setMembers] = useState<CrewMemberDto[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCrewMembers = useCallback(
    async (page: number): Promise<GetCrewMemberListResponseDto> => {
      if (!searchQuery) {
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getCrewMemberList(Number(crewId), page);
        const filteredItems = response.items.filter(
          (member) =>
            member.joined &&
            (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              member.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        const sortedItems = filteredItems.sort((a, b) => {
          const positionA =
            sortPositions[a.position as keyof typeof sortPositions] ?? Infinity;
          const positionB =
            sortPositions[b.position as keyof typeof sortPositions] ?? Infinity;
          return positionA - positionB;
        });

        if (page === 0) {
          setMembers(sortedItems);
        } else {
          setMembers((prev) => [...prev, ...sortedItems]);
        }
        return { ...response, items: sortedItems };
      } catch (error) {
        console.error("크루원 데이터를 가져오는 중 오류 발생:", error);
        setError("크루원 데이터를 가져오는 중 오류가 발생했습니다.");
        return { pageNo: 0, lastPageNo: 0, items: [] };
      } finally {
        setLoading(false);
      }
    },
    [crewId, searchQuery]
  );

  const handlePositionChange = async (email: string, newPosition: string) => {
    const member = members.find((member) => member.email === email);
    const currentCaptain = members.find(
      (member) => member.position === "CAPTAIN"
    );

    if (member) {
      try {
        if (newPosition === "CAPTAIN" && currentCaptain) {
          await changeCaptain({
            crewId: Number(crewId),
            memberId: member.memberId,
            position: "PACER",
          });
          setMembers((prevMembers) =>
            prevMembers
              .map((m) =>
                m.email === email
                  ? { ...m, position: "CAPTAIN" }
                  : m.email === currentCaptain.email
                  ? { ...m, position: member.position }
                  : m
              )
              .sort((a, b) => {
                const positionA =
                  sortPositions[a.position as keyof typeof sortPositions] ??
                  Infinity;
                const positionB =
                  sortPositions[b.position as keyof typeof sortPositions] ??
                  Infinity;
                return positionA - positionB;
              })
          );
          navigate(`/crew/detail/${crewId}`);
        } else {
          await changeAuthority({
            crewId: Number(crewId),
            memberId: member.memberId,
            position: newPosition,
          });
          setMembers((prevMembers) =>
            prevMembers
              .map((m) =>
                m.email === email ? { ...m, position: newPosition } : m
              )
              .sort((a, b) => {
                const positionA =
                  sortPositions[a.position as keyof typeof sortPositions] ??
                  Infinity;
                const positionB =
                  sortPositions[b.position as keyof typeof sortPositions] ??
                  Infinity;
                return positionA - positionB;
              })
          );
        }
      } catch (error) {
        console.error("권한 변경 오류:", error);
        setError("권한 변경에 실패했습니다.");
      }
    } else {
      console.error("Member not found:", email);
    }
  };

  const positions = ["CAPTAIN", "PACER", "MEMBER"];

  const renderMemberItem = (member: CrewMemberDto) => (
    <li
      key={member.email}
      className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-100"
    >
      <div className="w-12 h-12 flex-shrink-0" onClick={() => navigate(`/profile/${member.memberId}`)}>
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
      <div className="flex-1 ml-3" onClick={() => navigate(`/profile/${member.memberId}`)}>
        <div className="font-bold">{member.name}</div>
        <div className="text-gray-600">{member.nickname}</div>
      </div>
      <div>
        {member.position === "CAPTAIN" ? (
          <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
            CAPTAIN
          </button>
        ) : (
          <select
            defaultValue={member.position}
            className="border border-gray-400 w-30 h-10 rounded-md text-sm bg-white"
            onChange={(e) => handlePositionChange(member.email, e.target.value)}
          >
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        )}
      </div>
    </li>
  );

  useEffect(() => {
    if (searchQuery) {
      setMembers([]);
    }
  }, [searchQuery]);

  return (
    <div className="relative flex flex-col max-w-[500px] mx-auto">
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
            <Searchicon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>
      <hr />

      {error && <div className="text-red-500 text-center mt-2">{error}</div>}

      <div>
        {searchQuery && (
          <InfiniteScrollComponent
            fetchKey={["crewMembers", searchQuery]}
            fetchData={fetchCrewMembers}
            ItemComponent={({ data }) => renderMemberItem(data)}
            className="crew-member-list"
          />
        )}
      </div>
    </div>
  );
};

export default CaptainPovCrewMemberSearchTemplate;
