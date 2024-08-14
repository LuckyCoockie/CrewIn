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
import ModalConfirm from "../../molecules/ModalConfirmMolecules";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CrewMemberDto | null>(
    null
  );
  const [originalPosition, setOriginalPosition] = useState<string | null>(null);
  const [action, setAction] = useState<"BAN" | "CAPTAIN" | null>(null);

  const modalTitle = action === "BAN" ? "알림" : "권한 변경";
  const modalMessage =
    action === "BAN"
      ? "회원을 정말로 강퇴하시겠습니까?"
      : "권한을 변경하시겠습니까?";

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (selectedMember && originalPosition !== null) {
      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.email === selectedMember.email
            ? { ...m, position: originalPosition }
            : m
        )
      );
    }
    setSelectedMember(null);
    setOriginalPosition(null);
    setAction(null);
  };

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
      if (newPosition === "CAPTAIN" && currentCaptain) {
        setSelectedMember(member);
        setOriginalPosition(member.position);
        setAction("CAPTAIN");
        setIsModalOpen(true);
      } else if (newPosition === "BAN") {
        setSelectedMember(member);
        setOriginalPosition(member.position);
        setAction("BAN");
        setIsModalOpen(true);
      } else {
        try {
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
        } catch (error) {
          console.error("권한 변경 오류:", error);
          setError("권한 변경에 실패했습니다.");
        }
      }
    } else {
      console.error("Member not found:", email);
    }
  };

  const handleConfirm = async () => {
    if (selectedMember) {
      if (action === "BAN") {
        try {
          await crewOut({
            crewId: Number(crewId),
            memberId: selectedMember.memberId,
          });
          setMembers((prevMembers) =>
            prevMembers.filter((m) => m.email !== selectedMember.email)
          );
          navigate(0);
        } catch (error) {
          console.error("강퇴 실패:", error);
          setError("강퇴에 실패했습니다.");
        } finally {
          handleModalClose();
        }
      } else if (action === "CAPTAIN") {
        try {
          const currentCaptain = members.find(
            (member) => member.position === "CAPTAIN"
          );
          if (currentCaptain) {
            await changeCaptain({
              crewId: Number(crewId),
              memberId: selectedMember.memberId,
              position: "PACER",
            });
            setMembers((prevMembers) =>
              prevMembers
                .map((m) =>
                  m.email === selectedMember.email
                    ? { ...m, position: "CAPTAIN" }
                    : m.email === currentCaptain.email
                    ? { ...m, position: "PACER" }
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
          }
        } catch (error) {
          console.error("캡틴 변경 실패:", error);
          setError("캡틴 변경에 실패했습니다.");
        } finally {
          handleModalClose();
        }
      }
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
    <li
      key={member.email}
      className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-100"
    >
      <div
        className="w-12 h-12 flex-shrink-0"
        onClick={() => navigate(`/profile/${member.memberId}`)}
      >
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.nickname}
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
      <div>
        {member.joined ? (
          member.position === "CAPTAIN" ? (
            <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
              CAPTAIN
            </button>
          ) : (
            <select
              className="border border-gray-400 w-30 h-10 rounded-md text-sm focus:ring-0 focus:border-black"
              value={member.position}
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
    <>
      <div className="relative flex flex-col max-w-[500px] mx-auto">
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
      {/* Modal 컴포넌트 */}
      {isModalOpen && (
        <ModalConfirm
          title={modalTitle}
          onClose={handleModalClose}
          onConfirm={handleConfirm} // 확인 클릭 시 처리 실행
          type="delete"
        >
          <p>{modalMessage}</p>
        </ModalConfirm>
      )}
    </>
  );
};

export default CaptainPovCrewMemberListTemplate;
