import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as MoreVerticalIcon } from "../../assets/icons/more_vertical.svg";
import BarTitle from "../atoms/Title/BarTitle";
import BarContent from "../atoms/Content/BarContent";
import ProfileImageComponent from "../atoms/ImageSize/ProfileImageComponent";
import ModalConfirm from "../molecules/ModalConfirmMolecules";

interface ProfileHeaderProps {
  profileImage: string;
  username: string;
  timeAgo: string;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
  authorId?: number;
  memberId?: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImage,
  memberId,
  authorId,
  username,
  timeAgo,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 모달 상태 관리
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setIsConfirmOpen(false); // 모달 닫기
  };

  return (
    <div className="flex items-center w-full mb-2">
      <div className="cursor-pointer" onClick={onClick}>
        <ProfileImageComponent src={profileImage} />
      </div>
      <div className="flex flex-col cursor-pointer" onClick={onClick}>
        <BarTitle title={username} />
        <BarContent content={timeAgo} />
      </div>
      {authorId === memberId && (
        <div className="ml-auto mr-1 relative" ref={dropdownRef}>
          <button onClick={toggleDropdown}>
            <MoreVerticalIcon className="w-6 h-6" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-400 rounded-sm z-10">
              <button
                onClick={() => {
                  onEdit();
                  setIsDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                수정
              </button>
              <button
                onClick={() => {
                  handleDelete(); // 삭제 핸들러로 모달 열기
                  setIsDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm w-full text-left"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}

      {isConfirmOpen && (
        <ModalConfirm
          title="알림"
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          type="delete"
        >
          <p>게시글을 삭제하시겠습니까?</p>
        </ModalConfirm>
      )}
    </div>
  );
};

export default ProfileHeader;
