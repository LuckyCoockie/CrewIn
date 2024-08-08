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
import {
  changeAuthority,
  ChangeAuthorityRequestDto,
} from "../../../apis/api/changeauthority";

const CaptainPovCrewMemberListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [crewId] = useState<number>(1); // 나중에 동적으로 설정
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setMembers] = useState<CrewMemberDto[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: CrewMemberListResponseDto = await getCrewMemberList(crewId);
        setMembers(data.items);
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

  const onSearchClick = () => {
    navigate("/crew/membersearch/captain");
  };

  const handlePositionChange = async (
    memberId: number,
    email: string,
    newPosition: string
  ) => {
    try {
      const dto: ChangeAuthorityRequestDto = {
        crewId,
        memberId,
        position: newPosition,
      };

      await changeAuthority(dto);

      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.email === email ? { ...member, position: newPosition } : member
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const joinedMembers = items.filter((member) => member.joined);
  const invitedMembers = items.filter(
    (member) => !member.joined && member.invited
  );

  const positions = ["CAPTAIN", "PACER", "MEMBER"];

  return (
    <div className="relative flex flex-col max-w-[550px] mx-auto">
      <header className="mb-1">
        <BackHeaderMediumOrganism text="크루원 조회" />
        <div className="flex items-center flex-grow justify-end">
          <Searchicon className="cursor-pointer" onClick={onSearchClick} />
        </div>
      </header>
      <hr />

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div>
        {joinedMembers.length === 0 ? (
          <div className="text-center">가입된 크루원이 없습니다.</div>
        ) : (
          <ul>
            {joinedMembers.map((member) => (
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
                  <select
                    className="border border-gray-400 w-30 h-10 rounded-md text-sm"
                    value={member.position}
                    onChange={(e) =>
                      handlePositionChange(
                        member.memberId,
                        member.email,
                        e.target.value
                      )
                    }
                  >
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
                    WAITING
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

export default CaptainPovCrewMemberListTemplate;
