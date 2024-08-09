import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const CrewMemberSearchTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCrewMembers = useCallback(
    async (page: number): Promise<GetCrewMemberListResponseDto> => {
      try {
        const data = await getCrewMemberList(Number(crewId), page);
        const filteredItems = data.items.filter(
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
        return { ...data, items: sortedItems };
      } catch (error) {
        console.error("크루원 데이터를 가져오는 중 오류 발생:", error);
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }
    },
    [crewId, searchQuery]
  );

  const handleSearchIconClick = () => {
    navigate("/crew/membersearch/captain");
  };

  const renderMemberItem = (member: CrewMemberDto) => (
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
  );

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
        <InfiniteScrollComponent
          fetchKey="crewMembersSearch"
          fetchData={fetchCrewMembers}
          ItemComponent={({ data }) => renderMemberItem(data)}
          className="crew-member-search-list"
        />
      </div>
    </div>
  );
};

export default CrewMemberSearchTemplate;
