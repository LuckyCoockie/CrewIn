import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import crewinlogo from '../assets/images/crewinlogo.png';
import filledfire from '../assets/images/filledfire.png';
import emptyfire from '../assets/images/emptyfire.png';
import shareicon from '../assets/images/shareicon.png';

import Userprofilebar from '../components/molecules/UserProfileBarMolecule';

const PostDetailPage: React.FC = () => {
    const location = useLocation();
    const { croppedImages, content } = location.state || {};
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [likes, setLikes] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const handleEdit = () => {
        console.log('Edit action');
        setIsDropdownOpen(false);
    };

    const handleDelete = () => {
        console.log('Delete action');
        setIsDropdownOpen(false);
    };

    const handleLike = () => {
        setLikes(prevLikes => hasLiked ? prevLikes - 1 : prevLikes + 1);
        setHasLiked(!hasLiked);
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('URL이 클립보드에 복사되었습니다.');
            })
            .catch(err => {
                console.error('URL 복사에 실패했습니다:', err);
            });
    };

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    if (!location.state) {
        return <div>No post data available</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="w-full max-w-md mb-1">
                <Userprofilebar
                    profileImage={crewinlogo}
                    username="쿄징이다"
                    timeAgo="3시간 전"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <Carousel
                    showThumbs={false}
                    showIndicators={true}
                    showStatus={false}
                    infiniteLoop={false}
                    autoPlay={false}
                >
                    {croppedImages.map((image: string, index: number) => (
                        <div key={index}>
                            <img src={image} alt={`Cropped ${index}`} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    ))}
                </Carousel>
            </div>

            <div className="flex items-center">
                <button onClick={handleLike} className="flex items-center ml-4">
                    <img
                        src={hasLiked ? filledfire : emptyfire}
                        alt="fire-icon"
                        className="w-7"
                    />
                </button>
                <span className="text-md ml-1 mt-1">{likes}명이 공감했어요!</span>
                <button onClick={handleShare} className="flex ml-auto mr-3">
                    <img
                        src={shareicon}
                        alt="share-icon"
                        className="w-4"
                    />
                </button>
            </div>
            <div className="border-t border-gray-300 my-2"></div>

            <div className="mb-2 ml-4">
                {isExpanded ? content : `${content.slice(0, 50)}${content.length > 50 ? '...' : ''}`}
                {content.length > 50 && (
                    <button
                        onClick={toggleContent}
                        className="text-blue-500 hover:underline ml-2"
                    >
                        {isExpanded ? '접기' : '더보기'}
                    </button>
                )}
            </div>

        </div>
    );
};

export default PostDetailPage;
