import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MoreVerticalButton from "../atoms/Button/MoreVerticalButton";
import QuitDropdownMolecule from "../molecules/QuitDropdownMolecule";
import SpinnerOverlayComponent from "../atoms/SpinnerOverlayComponent";
import { quitCrew } from "../../apis/api/crewdetail";
import ModalConfirm from "../molecules/ModalConfirmMolecules";

type CrewId = {
  crewId: number;
};

const QuitDropdownOrganism: React.FC<CrewId> = ({ crewId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleQuit = async () => {
    setIsLoader(true);
    setIsModalOpen(false);
    // 탈퇴 로직
    await quitCrew(crewId);
    navigate(`/crew`);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      {isLoader && <SpinnerOverlayComponent />}
      <div className=" relative" ref={dropdownRef}>
        <MoreVerticalButton onDropdownClick={toggleDropdownClick} />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md z-10">
            <QuitDropdownMolecule onQuit={openModal} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <ModalConfirm
          title="탈퇴"
          onClose={closeModal}
          onConfirm={handleQuit}
          type="delete"
        >
          <p>정말로 크루를 탈퇴하시겠습니까?</p>
        </ModalConfirm>
      )}
    </>
  );
};

export default QuitDropdownOrganism;
