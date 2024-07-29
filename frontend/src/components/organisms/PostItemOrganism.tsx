import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import crewinlogo from "../../assets/images/crewinlogo.png";
import filledfire from "../../assets/images/filledfire.png";
import emptyfire from "../../assets/images/emptyfire.png";
import shareicon from "../../assets/images/shareicon.png";
import Userprofilebar from "../molecules/UserProfileBarMolecule";
import { PostDto } from "../../apis/api/crewPostList";

type OwnProps = {
  postData: PostDto;
  onEditClicked?: (postId: number) => Promise<void>;
  onDeleteClicked?: (postId: number) => Promise<void>;
  onLikesClicked?: (postId: number) => Promise<void>;
};

const PostItemComponent: React.FC<OwnProps> = ({
  postData,
  onEditClicked,
  onDeleteClicked,
  onLikesClicked,
}) => {
  const [likes, setLikes] = useState<number>(postData.heartCount);
  const [hasLiked, setHasLiked] = useState<boolean>(postData.isHearted);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleEdit = () => {
    if (onEditClicked) onEditClicked(postData.id);
  };

  const handleDelete = () => {
    if (onDeleteClicked) onDeleteClicked(postData.id);
  };

  const handleLike = () => {
    if (onLikesClicked) onLikesClicked(postData.id);
    setLikes(hasLiked ? likes - 1 : likes + 1);
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

  if (!postData) {
    return <div>No post data available</div>;
  }

  return (
    <div className="flex flex-col items-center max-w-[550px] mt-4 mb-20 relative">
      <div className="w-full">
        <Userprofilebar
          profileImage={crewinlogo}
          username={postData.crewName}
          timeAgo={postData.updatedAt}
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
          {postData.postImages.map((image: string, index: number) => (
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
    </div>
  );
};

export default PostItemComponent;
