import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import MoreVerticalButton from "../atoms/Button/MoreVerticalButton";
import EditDropdownMolecule from "../molecules/EditDropdownMolecule";
import DeleteDropdownMolecule from "../molecules/DeleteDropdownMolecule";
import SpinnerOverlayComponent from "../atoms/SpinnerOverlayComponent";
import ModalConfirm from "../molecules/ModalConfirmMolecules";
import Modal from "../molecules/ModalMolecules";

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
  deleteMessage?: string;
};

const EditDeleteDropdownOrganism: React.FC<PropsData> = ({
  type,
  idData,
  idData2,
  deleteMessage = "이 항목을 정말로 삭제하시겠습니까?", // 기본 삭제 메시지
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toggleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    if (type === "CREW") {
      navigate(`/crew/edit/${idData}`);
    } else if (type === "SESSION") {
      navigate(`/session/${idData}/edit`);
    } else if (type === "NOTICE") {
      navigate(`/crew/detail/${idData2}/notice/${idData}/edit`);
    }
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoader(true);
    setIsModalOpen(false);
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
      queryClient.invalidateQueries("crewNotice");
    } catch (error) {
      console.error("삭제 실패:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoader(false);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
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
      <div className="relative" ref={dropdownRef}>
        <MoreVerticalButton onDropdownClick={toggleDropdownClick} />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md z-10">
            <EditDropdownMolecule onEdit={handleEdit} />
            <DeleteDropdownMolecule onDelete={handleDeleteClick} />
          </div>
        )}
      </div>
      {isModalOpen && (
        <ModalConfirm
          title="확인"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        >
          <p>{deleteMessage}</p>
        </ModalConfirm>
      )}
      {isErrorModalOpen && (
        <Modal title="오류" onClose={handleCloseErrorModal}>
          <p>삭제 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        </Modal>
      )}
    </>
  );
};

export default EditDeleteDropdownOrganism;
