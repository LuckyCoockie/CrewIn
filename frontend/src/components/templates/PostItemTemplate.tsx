/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import UserProfileBar from "../../components/molecules/UserProfileBarMolecule";
import UserProfileBarNoMenu from "../../components/molecules/UserProfileBarNoMenuMolecule";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import { ReactComponent as ShareIcon } from "../../assets/icons/shareicon.svg";
import { PostDto } from "../../apis/api/postlist";
import { deletePost } from "../../apis/api/postdelete";
import { registerPostHeart } from "../../apis/api/heart";
import { deletePostHeart } from "../../apis/api/heartdelete";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";

export interface ItemComponentProps<T> {
  data: T;
}

const PostItemComponent: React.FC<ItemComponentProps<PostDto>> = ({ data }) => {
  const {
    id,
    postImages: croppedImages,
    content,
    title,
    authorName,
    heartCount,
    isHearted,
    createdAt,
    profileImage,
    postType,
    authorId,
    // comments,
  } = data;
  const memberId = useSelector((state: RootState) => state.auth.memberId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [likes, setLikes] = useState<number>(heartCount);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(isHearted);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setLikes(heartCount);
    setIsHeartedState(isHearted);
  }, [heartCount, isHearted]);

  // 공유하기
  useEffect(() => {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY;
    if (!(window as any).Kakao.isInitialized()) {
      (window as any).Kakao.init(kakaoAppKey);
    }
  }, []);

  const handleEdit = () => {
    navigate(`/post/${id}/edit`);
  };

  const handleUserProfile = (authorId: number) => {
    navigate(`/profile/${authorId}`);
  };

  const handleCrewDetail = (crewId: number) => {
    navigate(`/crew/detail/${crewId}`);
  };

  const handleDelete = async () => {
    await deletePost(id);
    navigate(0);
  };

  const likeMutation = useMutation(registerPostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      setLikes((prevLikes) => prevLikes + 1);
      setIsHeartedState(true);
    },
    onError: () => { },
  });

  const unlikeMutation = useMutation(deletePostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      setLikes((prevLikes) => prevLikes - 1);
      setIsHeartedState(false);
    },
    onError: () => { },
  });

  const handleLike = () => {
    if (isHeartedState) {
      unlikeMutation.mutate(id);
    } else {
      likeMutation.mutate(id);
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleShare = () => {
    const kakao = (window as any).Kakao;
    if (!kakao) {
      return;
    }

    const postDetailUrl = `${window.location.origin}/post/${id}`;
    kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: authorName,
        description: content.substring(0, 100) + "...",
        imageUrl: croppedImages.length > 0 ? croppedImages[0] : "",
        link: {
          mobileWebUrl: postDetailUrl,
          webUrl: postDetailUrl,
        },
      },
      buttons: [
        {
          title: "View Post",
          link: {
            mobileWebUrl: postDetailUrl,
            webUrl: postDetailUrl,
          },
        },
      ],
    });
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageClick = () => {
    navigate(`/post/${id}`);
  };

  const timeAgo = formatDistanceToNow(parseISO(createdAt), {
    addSuffix: true,
    locale: ko,
  })
    .replace("약 ", "")
    .replace(" 후", " 전");

  return (
    <div className="w-full mb-4">
      <div className="mx-2">
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
            authorId={authorId}
            memberId={memberId!}
            onClick={() => handleUserProfile(authorId)}
          />
        )}
      </div>
      {croppedImages && croppedImages.length > 0 ? (
        <div className="relative cursor-pointer sm:mx-1">
          <Carousel
            showThumbs={false}
            showIndicators={true}
            showStatus={false}
            infiniteLoop={false}
            autoPlay={false}
          >
            {croppedImages.map((image, index) => (
              <div key={image} className="relative">
                <img
                  src={image}
                  alt={`Cropped ${index}`}
                  style={{ width: "100%", aspectRatio: 1 }}
                  className="object-cover"
                />
              </div>
            ))}
          </Carousel>
        </div>
      ) : postType === "NOTICE" && profileImage ? (
        <div className="sm:mx-1">
          <div className="relative cursor-pointer square">
            <img src={profileImage} alt="Profile" />
          </div>
        </div>
      ) : null}
      <div className="flex items-center mt-2">
        <button onClick={handleLike} className="flex items-center ml-3">
          <img
            src={isHeartedState ? filledFire : emptyFire}
            alt="fire-icon"
            className={`w-7 h-7 object-contain fire-icon ${isAnimating ? "animate" : ""
              }`}
          />
        </button>
        <button onClick={handleShare} className="flex ml-auto mr-3">
          <ShareIcon />
        </button>
      </div>
      <div>
        <div>
          <p className="text-md ml-3 mt-2">{likes}명이 공감했어요!</p>
        </div>
        <div className="mb-2 mx-3 break-all">
          {postType === "NOTICE" ? (
            <>
              <div className="">
                {isExpanded ? (
                  <>
                    <span className="font-bold">{authorName}</span>{" "}
                    <span onClick={handleImageClick}>{title} </span>
                    <br />
                    <span
                      style={{ whiteSpace: "pre-line" }}
                      onClick={handleImageClick}
                    >
                      {content}{" "}
                    </span>
                    <button
                      className="font-bold text-color"
                      onClick={toggleContent}
                    >
                      접기
                    </button>
                  </>
                ) : content.length > 40 ? (
                  <>
                    <span className="font-bold">{authorName}</span>{" "}
                    <span onClick={handleImageClick}>{title} </span>
                    <br />
                    <span
                      style={{ whiteSpace: "pre-line" }}
                      onClick={handleImageClick}
                    >
                      {content.substring(0, 40)}...{" "}
                    </span>
                    <button
                      className="font-bold text-color"
                      onClick={toggleContent}
                    >
                      더보기
                    </button>
                  </>
                ) : (
                  <>
                    <span className="font-bold">{authorName}</span>{" "}
                    <span onClick={handleImageClick}>{title} </span>
                    <br />
                    <span style={{ whiteSpace: "pre-line" }}>{content}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {isExpanded ? (
                <>
                  <span className="font-bold">{authorName}</span>{" "}
                  <span
                    style={{ whiteSpace: "pre-line" }}
                    onClick={handleImageClick}
                  >
                    {content}{" "}
                  </span>
                  <button
                    className="font-bold text-color"
                    onClick={toggleContent}
                  >
                    접기
                  </button>
                </>
              ) : content.length > 40 ? (
                <>
                  <span className="font-bold">{authorName}</span>{" "}
                  <span
                    style={{ whiteSpace: "pre-line" }}
                    onClick={handleImageClick}
                  >
                    {content.substring(0, 40)}...{" "}
                  </span>
                  <button
                    className="font-bold text-color"
                    onClick={toggleContent}
                  >
                    더보기
                  </button>
                </>
              ) : (
                <>
                  <span className="font-bold" onClick={handleImageClick}>
                    {authorName}
                  </span>{" "}
                  <span
                    style={{ whiteSpace: "pre-line" }}
                    onClick={handleImageClick}
                  >
                    {content}
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="border-b border-gray-300 mx-1"></div>
    </div>
  );
};

export default PostItemComponent;
