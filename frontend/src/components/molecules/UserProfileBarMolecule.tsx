import React, { useState, useEffect, useRef } from "react";
import menuicon from "../../assets/images/menu-vertical-icon.png";
import BarTitle from "../atoms/Title/BarTitle";
import BarContent from "../atoms/Content/BarContent";
import ProfileImageComponent from "../atoms/ImageSize/ProfileImageComponent";

interface ProfileHeaderProps {
  profileImage: string;
  username: string;
  timeAgo: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImage,
  username,
  timeAgo,
  onEdit,
  onDelete,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <div className="flex items-center w-full mb-4">
      <ProfileImageComponent src={profileImage} />
      <div className="flex flex-col">
        <BarTitle title={username} />
        <BarContent content={timeAgo} />
      </div>
      <div className="ml-auto mr-2 relative" ref={dropdownRef}>
        <button onClick={toggleDropdown}>
          <img src={menuicon} alt="menu-icon" />
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
                onDelete();
                setIsDropdownOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm w-full text-left"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
