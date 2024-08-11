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
    authorName,
    heartCount,
    isHearted,
    createdAt,
    profileImage,
    postType,
    authorId,
  } = data;
  const memberId = useSelector((state: RootState) => state.auth.memberId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [likes, setLikes] = useState<number>(heartCount);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(isHearted);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    setLikes(heartCount);
    setIsHeartedState(isHearted);
  }, [heartCount, isHearted]);

  useEffect(() => {
    if (!(window as any).Kakao.isInitialized()) {
      (window as any).Kakao.init("16a9019862d8945c0a1082f314f6cef0");
    }
  }, []);

  const handleEdit = () => {
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

  const likeMutation = useMutation(registerPostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      setLikes((prevLikes) => prevLikes + 1);
      setIsHeartedState(true);
    },
    onError: (error) => {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
    },
  });

  const unlikeMutation = useMutation(deletePostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      setLikes((prevLikes) => prevLikes - 1);
      setIsHeartedState(false);
    },
    onError: (error) => {
      console.error("좋아요 취소 처리 중 오류가 발생했습니다:", error);
    },
  });

  const handleLike = () => {
    if (isHeartedState) {
      unlikeMutation.mutate(id);
    } else {
      likeMutation.mutate(id);
    }
  };

  const handleShare = () => {
    const kakao = (window as any).Kakao;
    if (!kakao) {
      console.error("Kakao SDK not loaded");
      return;
    }

    kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: authorName,
        description: content.substring(0, 100) + "...",
        imageUrl: croppedImages.length > 0 ? croppedImages[0] : "",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "View Post",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const timeAgo = formatDistanceToNow(parseISO(createdAt), {
    addSuffix: true,
    locale: ko,
  })
    .replace("약 ", "")
    .replace(" 후", " 전");

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
          authorId={authorId}
          memberId={memberId!}
          onClick={() => handleUserProfile(authorId)}
        />
      )}
      {croppedImages && croppedImages.length > 0 && (
        <div className="relative">
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
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
      <div className="flex items-center mt-2">
        <button onClick={handleLike} className="flex items-center ml-3">
          <img
            src={isHeartedState ? filledFire : emptyFire}
            alt="fire-icon"
            className="w-7 h-7 object-contain"
          />
        </button>
        <span className="text-md ml-1">{likes}명이 공감했어요!</span>
        <button onClick={handleShare} className="flex ml-auto mr-3">
          <ShareIcon className="w-5" />
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
