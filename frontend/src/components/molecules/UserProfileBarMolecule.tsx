import React, { useState } from 'react';
import menuicon from '../../assets/images/menu-vertical-icon.png';

interface ProfileHeaderProps {
    profileImage: string;
    username: string;
    timeAgo: string;
    onEdit: () => void;
    onDelete: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileImage, username, timeAgo, onEdit, onDelete }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="flex items-center w-full mb-4">
            <img src={profileImage} alt="profile" className="w-10 h-10 rounded-full mx-3 mr-3" />
            <div className="flex flex-col">
                <span className="font-bold">{username}</span>
                <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
            <div className="ml-auto mr-2 relative">
                <button onClick={toggleDropdown}>
                    <img src={menuicon} alt="menu-icon" />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md z-10">
                        <button
                            onClick={() => { onEdit(); setIsDropdownOpen(false); }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => { onDelete(); setIsDropdownOpen(false); }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
