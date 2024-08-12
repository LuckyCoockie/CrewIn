import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  getPostDetail,
  PostDetailResponseDto,
} from "../../apis/api/postdetail";
import { registerPostHeart } from "../../apis/api/heart";
import { deletePostHeart } from "../../apis/api/heartdelete";
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";
import UserProfileBarNoMenu from "../../components/molecules/UserProfileBarNoMenuMolecule";
import UserProfileBar from "../../components/molecules/UserProfileBarMolecule";
import { Carousel } from "react-responsive-carousel";
import EditDeleteDropdownOrganism from "../../components/organisms/EditDeleteDropdownOrganism";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../apis/api/postdelete";

const PostDetailPage: React.FC = () => {
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
      console.log("Post Type:", postData.postType);
      setLikes(postData.heartCount);
      setIsHeartedState(postData.isHearted);
    }
  }, [postData]);

  const likeMutation = useMutation(registerPostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetail", id]);
      setLikes((prevLikes) => prevLikes + 1);
      setIsHeartedState(true);
    },
    onError: (error) => {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
    },
  });

  const unlikeMutation = useMutation(deletePostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetail", id]);
      setLikes((prevLikes) => prevLikes - 1);
      setIsHeartedState(false);
    },
    onError: (error) => {
      console.error("좋아요 취소 처리 중 오류가 발생했습니다:", error);
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
      console.error("게시물 삭제 요청 중 오류가 발생했습니다:", error);
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
        <div className="flex items-center">
          {postData.postType === "NOTICE" ? (
            <UserProfileBarNoMenu
              profileImage={postData.profileImage}
              username={postData.authorName}
              timeAgo={timeAgo}
              onClick={() => navigate(`/crew/detail/${postData.authorId}`)}
            />
          ) : (
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
          )}
          {memberId === postData.authorId && (
            <div className="me-4">
              <EditDeleteDropdownOrganism type="POST" idData={postData.id} />
            </div>
          )}
        </div>
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
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Carousel>
        <div className="flex items-center mt-2 mb-1">
          <button onClick={handleLike} className="flex items-center ml-3">
            <img
              src={isHeartedState ? filledFire : emptyFire}
              alt="fire-icon"
              className={`w-6 h-6 object-contain fire-icon ${
                isAnimating ? "animate" : ""
              }`}
            />
          </button>
        </div>
        <span className="text-md ml-3">{likes}명이 공감했어요!</span>
        <div className="mx-3">
          {postData.postType === "NOTICE" ? (
            <>
              <p>
                <span className="font-bold">{postData.authorName}</span>{" "}
                {postData.title}
              </p>
              <p>{postData.content}</p>
            </>
          ) : (
            <>
              <p>
                <span className="font-bold">{postData.authorName}</span>{" "}
                {postData.content}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;
