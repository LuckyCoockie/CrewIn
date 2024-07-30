import React, { useState } from "react";
import UserProfileBar from "../../components/molecules/UserProfileBarMolecule";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import crewinLogo from "../../assets/images/crewinlogo.png";
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import shareIcon from "../../assets/images/shareicon.png";
import { PostDto } from "../../apis/api/postlist";

export interface ItemComponentProps<T> {
  data: T;
}

const PostItemComponent: React.FC<ItemComponentProps<PostDto>> = ({ data }) => {
  const {
    postImages: croppedImages,
    content,
    authorName,
    heartCount,
    isHearted,
  } = data;
  const [likes, setLikes] = useState<number>(heartCount);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(isHearted);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleEdit = () => {
    console.log("Edit action");
  };

  const handleDelete = () => {
    console.log("Delete action");
  };

  const handleLike = () => {
    setLikes((prevLikes) => (isHeartedState ? prevLikes - 1 : prevLikes + 1));
    setIsHeartedState(!isHeartedState);

    if (!isHeartedState) {
      const alarmMessages = JSON.parse(localStorage.getItem("alarms") || "[]");
      alarmMessages.push("@@님이 회원님의 게시글에 좋아요를 눌렀습니다.");
      localStorage.setItem("alarms", JSON.stringify(alarmMessages));
    }
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

  return (
    <div className="w-full mb-4">
      <UserProfileBar
        profileImage={crewinLogo}
        username={authorName}
        timeAgo="3시간 전" // 이 부분은 데이터에 맞게 수정 필요
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
        {croppedImages.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Cropped ${index}`}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </Carousel>
      <div className="flex items-center mt-2">
        <button onClick={handleLike} className="flex items-center ml-3">
          <img
            src={isHeartedState ? filledFire : emptyFire}
            alt="fire-icon"
            className="w-7"
          />
        </button>
        <span className="text-md ml-1">{likes}명이 공감했어요!</span>
        <button onClick={handleShare} className="flex ml-auto mr-3">
          <img src={shareIcon} alt="share-icon" className="w-4" />
        </button>
      </div>
      <div className="border-t border-gray-300 my-2"></div>
      <div className="mb-2 mx-3 break-all">
        {isExpanded ? (
          <>
            {content}{" "}
            <button style={{ color: "blue" }} onClick={toggleContent}>
              접기
            </button>
          </>
        ) : content.length > 50 ? (
          <>
            {content.substring(0, 50)}...{" "}
            <button style={{ color: "blue" }} onClick={toggleContent}>
              더보기
            </button>
          </>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default PostItemComponent;
