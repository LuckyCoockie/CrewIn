import React, { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import UserProfileBar from "../../components/molecules/UserProfileBarMolecule";
import UserProfileBarNoMenu from "../../components/molecules/UserProfileBarNoMenuMolecule";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import shareIcon from "../../assets/images/shareicon.png";
import { PostDto } from "../../apis/api/postlist";
import { deletePost } from "../../apis/api/postdelete";
import { registerPostHeart } from "../../apis/api/heart";
import { deletePostHeart } from "../../apis/api/heartdelete";

export interface ItemComponentProps<T> {
  data: T;
}

const PostItemComponent: React.FC<ItemComponentProps<PostDto>> = ({ data }) => {
  const {
    id,
    postImages: croppedImages,
    content,
    authorName,
    heartCount,
    isHearted,
    createdAt,
    profileImage,
    postType,
    authorId,
  } = data;
  console.log(data);

  const navigate = useNavigate();

  const [likes, setLikes] = useState<number>(heartCount);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(isHearted);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleEdit = () => {
    console.log("edit");
    navigate(`/post/${id}/edit`, { state: { data } });
  };

  const handleUserProfile = (authorId: number) => {
    navigate(`/profile/${authorId}`);
  };

  const handleCrewDetail = (crewId: number) => {
    navigate(`/crew/detail/${crewId}`);
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate(0);
    } catch (error) {
      console.error("게시물 삭제 요청 중 오류가 발생했습니다:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (isHeartedState) {
        console.log(`Removing heart from post with ID: ${id}`);
        await deletePostHeart(id);
        setLikes((prevLikes) => prevLikes - 1);
      } else {
        console.log(`Adding heart to post with ID: ${id}`);
        await registerPostHeart(id);
        setLikes((prevLikes) => prevLikes + 1);
      }
      setIsHeartedState(!isHeartedState);
    } catch (error) {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
    }
  };

  const handleShare = () => {};

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  // Remove the prefix "약 " from the time ago string
  const timeAgo = formatDistanceToNow(parseISO(createdAt), {
    addSuffix: true,
    locale: ko,
  }).replace("약 ", "");

  return (
    <div className="w-full mb-4 pb-3">
      {postType === "NOTICE" ? (
        <UserProfileBarNoMenu
          profileImage={profileImage}
          username={authorName}
          timeAgo={timeAgo}
          onClick={() => handleCrewDetail(authorId)}
        />
      ) : (
        <UserProfileBar
          profileImage={profileImage}
          username={authorName}
          timeAgo={timeAgo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClick={() => handleUserProfile(authorId)}
        />
      )}
      {croppedImages && croppedImages.length > 0 && (
        <Carousel
          showThumbs={false}
          showIndicators={true}
          showStatus={false}
          infiniteLoop={false}
          autoPlay={false}
        >
          {croppedImages.map((image, index) => (
            <div key={image}>
              <img
                src={image}
                alt={`Cropped ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Carousel>
      )}
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
