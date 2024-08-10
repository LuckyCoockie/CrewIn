import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MoreVerticalButton from "../atoms/Button/MoreVerticalButton";
import QuitDropdownMolecule from "../molecules/QuitDropdownMolecule";
import SpinnerFullComponent from "../atoms/SpinnerFullComponent";
import { quitCrew } from "../../apis/api/crewdetail";

type CrewId = {
    crewId: number
}

const QuitDropdownOrganism: React.FC<CrewId> = ({crewId}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleQuit = async () => {
    setIsLoader(true);
    setIsDropdownOpen(false);
    // 삭제 로직 구현
        await quitCrew(crewId);
        navigate(`/crew`);
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
            <QuitDropdownMolecule onQuit={handleQuit} />
          </div>
        )}
      </div>
    </>
  );
};

export default QuitDropdownOrganism;
