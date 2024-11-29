import React, { useCallback, useState } from "react";
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

const CrewMemberListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();

  const [, setMembers] = useState<CrewMemberDto[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCrewMembers = useCallback(
    async (page: number): Promise<GetCrewMemberListResponseDto> => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCrewMemberList(Number(crewId), page);

        const sortedItems = response.items.sort((a, b) => {
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
        setError("크루원 데이터를 가져오는 중 오류가 발생했습니다.");
        return { pageNo: 0, lastPageNo: 0, items: [] };
      } finally {
        setLoading(false);
      }
    },
    [crewId]
  );

  const onSearchClick = () => {
    navigate(`/crew/detail/${crewId}/membersearch`);
  };

  const renderMemberItem = (member: CrewMemberDto) => (
    <li
      key={member.email}
      className="flex items-center p-2 border-b cursor-pointer hover:bg-primary-500"
      onClick={() => navigate(`/profile/${member.memberId}`)}
    >
      <div className="w-12 h-12 flex-shrink-0">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.nickname}
            className="w-full h-full object-cover rounded-full border bg-white"
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
        <span className="text-sub text-sm">{member.nickname}</span>
        <div className="text-sub">
          세션 참가 {member.attendanceCount}회
        </div>
      </div>
      <div>
        <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
          {member.joined ? member.position : "WAITING"}
        </button>
      </div>
    </li>
  );

  return (
    <div className="relative flex flex-col max-w-[500px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="크루원 조회" />
        <div className="flex items-center flex-grow justify-end">
          <Searchicon className="cursor-pointer fill-primary" onClick={onSearchClick} />
        </div>
      </header>
      <hr />

      {error && <div className="text-red-500 text-center mt-2">{error}</div>}

      <div>
        <InfiniteScrollComponent
          fetchKey="crewMembers"
          fetchData={fetchCrewMembers}
          ItemComponent={({ data }) => renderMemberItem(data)}
          className="crew-member-list"
        />
      </div>
    </div>
  );
};

export default CrewMemberListTemplate;
