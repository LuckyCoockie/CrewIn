import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import MoreVerticalButton from "../atoms/Button/MoreVerticalButton";
import EditDropdownMolecule from "../molecules/EditDropdownMolecule";
import DeleteDropdownMolecule from "../molecules/DeleteDropdownMolecule";
import MemberPlusDropdownMolecule from "../molecules/MemberPlusDropdownMolecule";
import SpinnerFullComponent from "../atoms/SpinnerFullComponent";

// crew
import { deleteCrew } from "../../apis/api/crewdetail";
// session
import { deleteSession } from "../../apis/api/sessiondetail";
// notice
import { deleteNotice } from "../../apis/api/crewdetail";

type PropsData = {
  type: "CREW" | "SESSION" | "NOTICE";
  idData?: number;
  idData2?: number;
  isCrew?: boolean;
};

const EditDeleteDropdownOrganism: React.FC<PropsData> = ({
  type,
  idData,
  idData2,
  isCrew,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // useQueryClient 훅을 사용하여 queryClient 객체를 가져옵니다.

  const toggleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    // 수정 로직 구현
    if (type === "CREW") {
      navigate(`/crew/edit/${idData}`); // 페이지 이동
    } else if (type === "SESSION") {
      navigate(`/session/edit/${idData}`); // 페이지 이동
    } else if (type === "NOTICE") {
      navigate(`/crew/detail/${idData2}/noticeedit/${idData}`);
    }
  };

  const handleDelete = async () => {
    setIsLoader(true);
    setIsDropdownOpen(false);
    // 삭제 로직 구현
    try {
      if (type === "CREW") {
        await deleteCrew(idData!);
        navigate(`/crew`);
      } else if (type === "SESSION") {
        await deleteSession(idData!);
        navigate(`/session?status=active`);
      } else if (type === "NOTICE") {
        await deleteNotice(idData!);
        navigate(`/crew/detail/${idData2}`);
      }
      queryClient.invalidateQueries("crewNotice"); // 쿼리 무효화
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const handleRouter = () => {
    navigate(`/crew/${idData}/invite`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      {isLoader && <SpinnerFullComponent />}
      <div className=" relative" ref={dropdownRef}>
        <MoreVerticalButton onDropdownClick={toggleDropdownClick} />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md z-10">
            <EditDropdownMolecule onEdit={handleEdit} />
            <DeleteDropdownMolecule onDelete={handleDelete} />
            {isCrew && <MemberPlusDropdownMolecule onClick={handleRouter} />}
          </div>
        )}
      </div>
    </>
  );
};

export default EditDeleteDropdownOrganism;
