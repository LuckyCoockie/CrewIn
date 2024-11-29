/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  commentsDto,
  getPostDetail,
  PostDetailResponseDto,
} from "../../apis/api/postdetail";
import { registerPostHeart } from "../../apis/api/heart";
import { deletePostHeart } from "../../apis/api/heartdelete";
import { ReactComponent as EmptyFire } from "../../assets/icons/emptyfire.svg";
import { ReactComponent as FilledFire } from "../../assets/icons/filledfire.svg";
import { ReactComponent as ShareIcon } from "../../assets/icons/shareicon.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";
import UserProfileBar from "../../components/molecules/UserProfileBarMolecule";
import { Carousel } from "react-responsive-carousel";
import { RootState } from "../../modules";
import { deletePost } from "../../apis/api/postdelete";

const PostDetailTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const memberId = useSelector((state: RootState) => state.auth.memberId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: postData,
    isLoading,
    error,
  } = useQuery<PostDetailResponseDto>(["postDetail", id], () =>
    getPostDetail(Number(id))
  );

  const [likes, setLikes] = useState<number>(postData?.heartCount || 0);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(
    postData?.isHearted || false
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (postData) {
      setLikes(postData.heartCount);
      setIsHeartedState(postData.isHearted);
    }
  }, [postData]);

  useEffect(() => {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY;
    if (!(window as any).Kakao.isInitialized()) {
      (window as any).Kakao.init(kakaoAppKey);
    }
  }, []);

  const likeMutation = useMutation(registerPostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetail", id]);
      setLikes((prevLikes) => prevLikes + 1);
      setIsHeartedState(true);
    },
    onError: (error) => {
      console.error("Failed to like the post", error);
    },
  });

  const unlikeMutation = useMutation(deletePostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetail", id]);
      setLikes((prevLikes) => prevLikes - 1);
      setIsHeartedState(false);
    },
    onError: (error) => {
      console.error("Failed to unlike the post", error);
    },
  });

  const handleLike = () => {
    if (isHeartedState) {
      unlikeMutation.mutate(Number(id));
    } else {
      likeMutation.mutate(Number(id));
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDelete = async () => {
    try {
      await deletePost(Number(id));
      navigate(0);
    } catch (error) {
      console.error("Failed to delete the post", error);
    }
  };

  const handleShare = () => {
    const kakao = (window as any).Kakao;
    if (kakao) {
      kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: postData?.authorName || "",
          description: postData?.content.substring(0, 100) + "...",
          imageUrl:
            postData?.postImages && postData.postImages.length > 0
              ? postData.postImages[0]
              : postData?.profileImage,
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
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!postData) {
    return <div>No data available</div>;
  }

  const timeAgo = formatDistanceToNow(parseISO(postData.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={postData.title} />
      </header>
      <div className="w-full">
        <div className="flex items-center mx-2">
          <UserProfileBar
            profileImage={postData.profileImage}
            username={postData.authorName}
            timeAgo={timeAgo}
            onEdit={() => navigate(`/post/${id}/edit`)}
            onDelete={handleDelete}
            authorId={postData.authorId}
            memberId={memberId!}
            onClick={() => navigate(`/profile/${postData.authorId}`)}
          />
        </div>
        {postData.postType === "NOTICE" && postData.postImages.length === 0 ? (
          <img
            src={postData.profileImage}
            alt="Profile"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <Carousel
            showThumbs={false}
            showIndicators={true}
            showStatus={false}
            infiniteLoop={false}
            autoPlay={false}
          >
            {postData.postImages?.map((image, index) => (
              <div key={image}>
                <img
                  src={image}
                  alt={`Post ${index}`}
                  style={{ width: "100%", aspectRatio: 1 }}
                  className="object-cover"
                />
              </div>
            ))}
          </Carousel>
        )}
        <div className="flex items-center mt-2 mb-2">
          <button onClick={handleLike} className="flex items-center ml-3">
            {isHeartedState ? (
              <FilledFire
                className={`w-7 object-contain fire-icon ${
                  isAnimating ? "animate" : ""
                } fill-primary`}
              />
            ) : (
              <EmptyFire
                className={`w-7 object-contain fire-icon ${
                  isAnimating ? "animate" : ""
                } fill-primary`}
              />
            )}
          </button>
          <button onClick={handleShare} className="flex ml-auto mr-3">
            <ShareIcon />
          </button>
        </div>
        <span className="text-md ml-3">{likes}명이 공감했어요!</span>
        <div className="mx-3">
          <p>
            <span className="font-bold">{postData.authorName}</span>{" "}
            <span style={{ whiteSpace: "pre-line" }}>{postData.content}</span>
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full border-t border-gray-300 my-5"></div>
        {/* 댓글 영역 */}
        <div className="mt-5 mx-3">
          <h2 className="text-lg font-bold mb-3">댓글</h2>
          {postData.comments.length > 0 ? (
            <ul>
              {postData.comments.map((comment: commentsDto) => (
                <li
                  key={comment.id}
                  className="flex items-start mb-6 p-3 rounded "
                >
                  {/* 프로필 사진 */}
                  <div className="w-12 h-12 rounded-full bg-black mr-4 flex-shrink-0"></div>
                  {/* 내용 */}
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center">
                      {/* 이름, 작성 시간 */}
                      <p className="font-bold">{comment.authorName}</p>
                      <span className="text-sm text-sub">
                        {formatDistanceToNow(parseISO(comment.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                    {/* 본문 */}
                    <p className="mt-1 text-gray-700">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sub">등록된 댓글이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetailTemplate;
