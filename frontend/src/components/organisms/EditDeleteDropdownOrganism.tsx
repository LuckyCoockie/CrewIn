import React, { useState, useRef, useEffect } from "react";
import MoreVerticalButton from "../atoms/Button/MoreVerticalButton";
import EditDropdownMolecule from "../molecules/EditDropdownMolecule";
import DeleteDropdownMolecule from "../molecules/DeleteDropdownMolecule";


const EditDeleteDropdownOrganism: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    // 수정 로직 구현
  };
  const handleDelete = () => {
    setIsDropdownOpen(false);
    // 삭제 로직 구현
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
