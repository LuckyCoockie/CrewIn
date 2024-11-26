import React, { useState } from "react";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";
import ModalConfirm from "../../molecules/ModalConfirmMolecules";

type Props = {
  logout: () => void;
};

const LogoutButton: React.FC<Props> = ({ logout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    closeModal();
    logout();
  };

  return (
    <>
      <LogoutIcon onClick={openModal} className="cursor-pointer" />

      {isModalOpen && (
        <ModalConfirm
          title="로그아웃"
          onClose={closeModal}
          onConfirm={handleLogout}
        >
          <p>정말로 로그아웃하시겠습니까?</p>
        </ModalConfirm>
      )}
    </>
  );
};

export default LogoutButton;
