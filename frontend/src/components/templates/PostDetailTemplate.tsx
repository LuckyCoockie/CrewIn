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
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import { ReactComponent as ShareIcon } from "../../assets/icons/shareicon.svg";
import { ReactComponent as CommentsIcon } from "../../assets/icons/comments_Icon.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism";
import InputTextAreaTypeMolecule from "../molecules/Input/InputTextAreaTypeMolecule";
import UserProfileBar from "../../components/molecules/UserProfileBarMolecule";
import { Carousel } from "react-responsive-carousel";
import { RootState } from "../../modules";
import { deletePost } from "../../apis/api/postdelete";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import { CreateCommentDto, postCreateComment } from "../../apis/api/comment";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";

type FormValues = {
  comment: string;
};

const PostDetailTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const memberId = useSelector((state: RootState) => state.auth.memberId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation(postCreateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetail", id]);
      setIsSubmitting(false);
    },
    onError: (error: ErrorResponseDto) => {
      alert(error.message);
      setIsSubmitting(false);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsSubmitting(true);

    const submitData: CreateCommentDto = {
      postId: Number(id),
      content: data.comment,
    };
    return mutation.mutate(submitData);
  };

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
  const schema = yup.object({
    comment: yup
      .string()
      .max(256, "256글자 이내로 입력해주세요.")
      .required("댓글을 입력해주세요."),
  });
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

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
            <img
              src={isHeartedState ? filledFire : emptyFire}
              alt="fire-icon"
              className={`w-7 h-7 object-contain fire-icon ${
                isAnimating ? "animate" : ""
              }`}
            />
          </button>
          <button className="flex ml-3 items-center">
            <CommentsIcon />
            <p className="ml-2">{postData.comments.length}</p>
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
      {/* 댓글 영역 */}
      <div className="w-full">
        <div className="w-full border-t border-gray-200 my-3"></div>
        <div className="mt-1 mx-3">
          {postData.comments.length > 0 ? (
            <ul>
              {postData.comments.map((comment: commentsDto) => (
                <li key={comment.id} className="flex mb-2 rounded items-center">
                  {/* 프로필 사진 */}
                  <img
                    src={comment.authorImage}
                    className="w-10 h-10 rounded-full mr-3"
                  ></img>
                  {/* 내용 */}
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center">
                      {/* 이름, 작성 시간 */}
                      <p className="font-bold">{comment.authorName}</p>
                      <span className="text-sm text-gray-400">
                        {formatDistanceToNow(parseISO(comment.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                    {/* 본문 */}
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 flex justify-center">
              첫 댓글을 남겨보세요!
            </p>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-1 mx-3">
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <InputTextAreaTypeMolecule
                id="comment"
                title=""
                placeholder={postData.authorName + "님에게 댓글 남기기"}
                {...field}
              />
            )}
          />
        </div>
        <div className="mt-1 mx-3">
          {isValid ? (
            <LargeAbleButton text="작성" isLoading={isSubmitting} />
          ) : (
            <LargeDisableButton text="작성" />
          )}
        </div>
      </form>
    </>
  );
};

export default PostDetailTemplate;
