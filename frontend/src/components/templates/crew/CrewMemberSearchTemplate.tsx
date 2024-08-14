import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import { ReactComponent as Searchicon } from "../../../assets/icons/searchicon.svg";
import { ReactComponent as CrewinLogo } from "../../../assets/icons/crewinlogo.svg";
import {
  getCrewMemberList,
  GetCrewMemberListResponseDto,
  CrewMemberDto,
} from "../../../apis/api/crewmemberlist";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";


const sortPositions: Record<string, number> = {
  CAPTAIN: 1,
  PACER: 2,
  MEMBER: 3,
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CrewMemberSearchTemplate: React.FC = () => {
  const { crewId } = useParams<{ crewId: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setMembers] = useState<CrewMemberDto[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const fetchCrewMembers = useCallback(
    async (page: number): Promise<GetCrewMemberListResponseDto> => {
      if (!debouncedSearchQuery) {
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }

      try {
        const data = await getCrewMemberList(Number(crewId), page);
        const filteredItems = data.items.filter(
          (member) =>
            member.joined &&
            (member.name
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
              member.nickname
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()))
        );
        const sortedItems = filteredItems.sort((a, b) => {
          const positionA =
            sortPositions[a.position as keyof typeof sortPositions] ?? Infinity;
          const positionB =
            sortPositions[b.position as keyof typeof sortPositions] ?? Infinity;
          return positionA - positionB;
        });

        setMembers((prevMembers) => [...prevMembers, ...sortedItems]);

        return { ...data, items: sortedItems };
      } catch (error) {
        console.error("크루원 데이터를 가져오는 중 오류 발생:", error);
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }
    },
    [crewId, debouncedSearchQuery]
  );

  const handleSearchIconClick = () => {
    // Implement navigation or other actions if needed
  };

  useEffect(() => {
    setMembers([]);
  }, [debouncedSearchQuery]);

  const renderMemberItem = (member: CrewMemberDto) => (
    <li
      key={member.email}
      className="flex items-center p-2 border-b hover:bg-gray-100"
      onClick={() => navigate(`/profile/${member.memberId}`)}
    >
      <div className="w-12 h-12 flex-shrink-0">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover rounded-full border"
          />
        ) : (
          <CrewinLogo className="w-full h-full object-cover rounded-full" />
        )}
      </div>
      <div
        className="flex-1 ml-3"
        onClick={() => navigate(`/profile/${member.memberId}`)}
      >
        <span className="font-bold">{member.name + " "}</span>
        <span className="text-gray-600 text-sm">{member.nickname}</span>
      <div className="text-gray-600">세션 참가 {member.attendanceCount}회</div>
      </div>
      <div className="flex gap-2">
        <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
          {member.position}
        </button>
      </div>
    </li>
  );

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
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Searchicon
              className="w-5 h-5 text-gray-400 cursor-pointer"
              onClick={handleSearchIconClick}
            />
          </div>
        </div>
      </header>
      <hr />

      <div>
        {debouncedSearchQuery && (
          <InfiniteScrollComponent
            fetchKey={["crewMembersSearch", debouncedSearchQuery]}
            fetchData={fetchCrewMembers}
            ItemComponent={({ data }) => renderMemberItem(data)}
            className="crew-member-search-list"
          />
        )}
      </div>
    </div>
  );
};

export default CrewMemberSearchTemplate;
