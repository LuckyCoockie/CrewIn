import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactComponent as Searchicon } from "../../assets/icons/searchicon.svg";
import InfiniteScrollComponent from "../../util/paging/component/InfinityScrollComponent";
import {
  searchCrewMembers,
  CrewSearchMemberDto,
} from "../../apis/api/crewsearch";
import { inviteCrewMember } from "../../apis/api/crewinvite";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";

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

const CrewInvitePage: React.FC = () => {
  const { crewId } = useParams<{ crewId: string }>();
  const [query, setQuery] = useState<string>("");
  const [searchExecuted, setSearchExecuted] = useState<boolean>(false);
  const [invitingMemberId, setInvitingMemberId] = useState<number | null>(null);
  const [, setMembers] = useState<CrewSearchMemberDto[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  const fetchInviteMembers = useCallback(
    async (
      pageNo: number
    ): Promise<{
      pageNo: number;
      lastPageNo: number;
      items: CrewSearchMemberDto[];
    }> => {
      if (!crewId || debouncedQuery.trim() === "") {
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }

      try {
        const response = await searchCrewMembers(
          Number(crewId),
          debouncedQuery,
          pageNo
        );
        setMembers((prevMembers) => [...prevMembers, ...response.items]);
        return response;
      } catch (error) {
        return { pageNo: 0, lastPageNo: 0, items: [] };
      }
    },
    [crewId, debouncedQuery]
  );

  const handleInvite = async (memberId: number) => {
    if (!crewId) return;

    setInvitingMemberId(memberId);

    await inviteCrewMember({
      memberId,
      crewId: Number(crewId),
    });
  };

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      setSearchExecuted(true);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative flex flex-col max-w-[500px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="" />
        <div className="relative flex-1 font-weight-sm">
          <input
            className="h-6 px-4 pr-12 text-md w-full focus:outline-none focus:ring-0 border-none"
            type="search"
            placeholder="이름, 닉네임"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Searchicon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>
      <hr />

      <div>
        {searchExecuted && (
          <InfiniteScrollComponent
            fetchKey={["inviteMembers", debouncedQuery]}
            fetchData={fetchInviteMembers}
            ItemComponent={({ data }: { data: CrewSearchMemberDto }) => (
              <li
                key={data.memberId}
                className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-100"
              >
                <div
                  className="w-12 h-12 flex-shrink-0"
                  onClick={() => navigate(`/profile/${data.memberId}`)}
                >
                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.name}
                      className="w-full h-full object-cover rounded-full border"
                    />
                  ) : (
                    <CrewinLogo className="w-full h-full object-cover rounded-full border" />
                  )}
                </div>
                <div
                  className="flex-1 ml-3"
                  onClick={() => navigate(`/profile/${data.memberId}`)}
                >
                  <div>
                    <span className="font-bold">{data.name + " "}</span>
                    <span className="text-gray-600 text-sm">
                      {data.nickname}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    세션 참가 {data.attendanceCount}회
                  </div>
                </div>
                <div>
                  <button
                    className="border border-gray-400 w-20 h-10 rounded-md text-sm"
                    onClick={() => handleInvite(data.memberId)}
                    disabled={invitingMemberId === data.memberId}
                  >
                    {invitingMemberId === data.memberId ? "요청됨" : "초대하기"}
                  </button>
                </div>
              </li>
            )}
            className="invite-member-list"
          />
        )}
      </div>
    </div>
  );
};

export default CrewInvitePage;
