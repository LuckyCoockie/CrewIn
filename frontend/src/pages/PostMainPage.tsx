import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import crewinlogo from "../assets/images/crewinlogo.png";
import filledfire from "../assets/images/filledfire.png";
import emptyfire from "../assets/images/emptyfire.png";
import shareicon from "../assets/images/shareicon.png";
import Userprofilebar from "../components/molecules/UserProfileBarMolecule";
import { ReactComponent as CrewinLogo } from "../assets/icons/crewinlogo.svg";
import { ReactComponent as Alarmicon } from "../assets/icons/alarmicon.svg";
import { ReactComponent as Searchicon } from "../assets/icons/searchicon.svg";
import { ReactComponent as Postcreateicon } from "../assets/icons/postcreateicon.svg";

const PostMainPage: React.FC = () => {
  const [postData, setPostData] = useState<{
    croppedImages: string[];
    content: string;
  } | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPostData = localStorage.getItem("postData");
    if (storedPostData) {
      setPostData(JSON.parse(storedPostData));
    }
  }, []);

  const handleEdit = () => {
    console.log("Edit action");
  };

  const handleDelete = () => {
    console.log("Delete action");
  };

  const handleLike = () => {
    setLikes((prevLikes) => (hasLiked ? prevLikes - 1 : prevLikes + 1));
    setHasLiked(!hasLiked);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다.");
      })
      .catch((err) => {
        console.error("URL 복사에 실패했습니다:", err);
      });
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePostCreate = () => {
    navigate("/post");
  };

  const handleSearch = () => {
    navigate("/search");
  }

  if (!postData) {
    return <div>No post data available</div>;
  }

  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20">
      <div className="flex items-center bg-white w-full mb-10">
        <div className="flex items-center">
          <CrewinLogo />
        </div>
        <div className="flex items-center flex-grow justify-end mr-2">
          <Searchicon className="w-6 h-6 mr-4" onClick={handleSearch} />
          <Alarmicon className="w-6 h-6" />
        </div>
      </div>
      <div className="w-full">
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
          {postData.croppedImages.map((image: string, index: number) => (
            <div key={index}>
              <img
                src={image}
                alt={`Cropped ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Carousel>
        <div className="flex items-center">
          <button onClick={handleLike} className="flex items-center ml-3 mt-2">
            <img
              src={hasLiked ? filledfire : emptyfire}
              alt="fire-icon"
              className="w-7"
            />
          </button>
          <span className="text-md ml-1 mt-3">{likes}명이 공감했어요!</span>
          <button onClick={handleShare} className="flex ml-auto mr-3 mt-3">
            <img src={shareicon} alt="share-icon" className="w-4" />
          </button>
        </div>
        <div className="border-t border-gray-300 my-2"></div>
        <div className="mb-2 mx-3 break-all">
          {isExpanded || postData.content.length <= 50
            ? postData.content
            : postData.content.substring(0, 50) + "... "}
          {postData.content.length > 50 && (
            <button style={{ color: "blue" }} onClick={toggleContent}>
              {isExpanded ? "접기" : "더보기"}
            </button>
          )}
        </div>
      </div>
      <div style={{ position: "fixed", right: "8px", bottom: "90px" }}>
        <Postcreateicon onClick={handlePostCreate} />
      </div>
    </div>
  );
};

export default PostMainPage;
