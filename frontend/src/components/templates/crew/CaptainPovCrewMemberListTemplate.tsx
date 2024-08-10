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
import { changeAuthority } from "../../../apis/api/changeauthority";
import { changeCaptain } from "../../../apis/api/captainchange";
import { crewOut } from "../../../apis/api/crewout";
import InfiniteScrollComponent from "../../../util/paging/component/InfinityScrollComponent";

// Captain - Pacer - Member 순으로 정렬
const sortPositions: Record<string, number> = {
  CAPTAIN: 1,
  PACER: 2,
  MEMBER: 3,
};

const CaptainPovCrewMemberListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { crewId } = useParams<{ crewId: string }>();

  const [members, setMembers] = useState<CrewMemberDto[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCrewMembers = useCallback(
    async (page: number): Promise<GetCrewMemberListResponseDto> => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCrewMemberList(Number(crewId), page);
        const sortedMembers = response.items.sort((a, b) => {
          return (
            (sortPositions[a.position] || Infinity) -
            (sortPositions[b.position] || Infinity)
          );
        });
        if (page === 0) {
          setMembers(sortedMembers);
        } else {
          setMembers((prev) => [...prev, ...sortedMembers]);
        }
        return response;
      } catch (error) {
        console.error("크루원 데이터를 가져오는 중 오류 발생:", error);
        setError("크루원 데이터를 가져오는 중 오류가 발생했습니다.");
        return { pageNo: 0, lastPageNo: 0, items: [] };
      } finally {
        setLoading(false);
      }
    },
    [crewId]
  );

  const handlePositionChange = async (email: string, newPosition: string) => {
    const member = members.find((member) => member.email === email);
    const currentCaptain = members.find(
      (member) => member.position === "CAPTAIN"
    );

    if (member) {
      console.log("Changing position for:", member);
      try {
        if (newPosition === "CAPTAIN" && currentCaptain) {
          await changeCaptain({
            crewId: Number(crewId),
            memberId: member.memberId,
            position: "PACER",
          });
          console.log("Captain changed successfully");
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
                return (
                  (sortPositions[a.position] || Infinity) -
                  (sortPositions[b.position] || Infinity)
                );
              })
          );
          navigate(`/crew/detail/${crewId}`);
        } else if (newPosition === "BAN") {
          await crewOut({
            crewId: Number(crewId),
            memberId: member.memberId,
          });
          setMembers((prevMembers) =>
            prevMembers.filter((m) => m.email !== email)
          );
          navigate(0);
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
                return (
                  (sortPositions[a.position] || Infinity) -
                  (sortPositions[b.position] || Infinity)
                );
              })
          );
          navigate(0);
        }
      } catch (error) {
        console.error("권한 변경 오류:", error);
        setError("권한 변경에 실패했습니다.");
      }
    } else {
      console.error("Member not found:", email);
    }
  };

  const onSearchClick = () => {
    navigate(`/crew/detail/${crewId}/membersearch/captain`);
  };

  const getPositions = (member: CrewMemberDto) => {
    const basePositions = ["CAPTAIN", "PACER", "MEMBER"];
    if (member.position === "MEMBER") {
      return [...basePositions, "BAN"];
    }
    return basePositions;
  };

  const renderMemberItem = (member: CrewMemberDto) => (
    <li key={member.email} className="flex items-center p-2 border-b">
      <div className="w-12 h-12 flex-shrink-0">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.nickname}
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
      <div>
        {member.joined ? (
          member.position === "CAPTAIN" ? (
            <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
              CAPTAIN
            </button>
          ) : (
            <select
              className="border border-gray-400 w-30 h-10 rounded-md text-sm"
              defaultValue={member.position}
              onChange={(e) =>
                handlePositionChange(member.email, e.target.value)
              }
            >
              {getPositions(member).map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          )
        ) : (
          <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
            WAITING
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="크루원 관리" />
        <div className="flex items-center flex-grow justify-end">
          <Searchicon className="cursor-pointer" onClick={onSearchClick} />
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

export default CaptainPovCrewMemberListTemplate;
