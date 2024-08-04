import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 import 합니다.
import MoreVerticalButton from "../atoms/Button/MoreVerticalButton";
import EditDropdownMolecule from "../molecules/EditDropdownMolecule";
import DeleteDropdownMolecule from "../molecules/DeleteDropdownMolecule";

// crew
import { deleteCrew } from "../../apis/api/crewdetail";
// session
import { deleteSession } from "../../apis/api/sessiondetail";

type PropsData = {
  type: "CREW" | "SESSION" | "NOTICE";
  idData?: number;
};

const EditDeleteDropdownOrganism: React.FC<PropsData> = ({ type, idData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 객체를 가져옵니다.

  const toggleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    // 수정 로직 구현
    if (type === "CREW") {
      navigate(`/crew/edit/${idData}`); // 페이지 이동
    } else if (type === "SESSION") {
      navigate(`/session/edit/${idData}`) // 페이지 이동
    }
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    // 삭제 로직 구현
    if (type === "CREW") {
      deleteCrew(idData!);
    } else if (type === "SESSION") {
      deleteSession(idData!)
    }
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
    <div className="ml-auto mr-2 relative" ref={dropdownRef}>
      <MoreVerticalButton onDropdownClick={toggleDropdownClick} />
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md z-10">
          <EditDropdownMolecule onEdit={handleEdit} />
          <DeleteDropdownMolecule onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
};

export default EditDeleteDropdownOrganism;
