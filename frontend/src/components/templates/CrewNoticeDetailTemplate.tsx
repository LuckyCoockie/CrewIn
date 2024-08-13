import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  getCrewNoticeDetail,
  CrewNoticeDetailRequestDto,
  CrewNoticeDetailResponseDto,
} from "../../apis/api/crewdetail";
import { getCrewInfo } from "../../apis/api/crewdetail";
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import UserProfileBarNoMenu from "../molecules/UserProfileBarNoMenuMolecule";
import { Carousel } from "react-responsive-carousel";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";
import { registerPostHeart } from "../../apis/api/heart";
import { deletePostHeart } from "../../apis/api/heartdelete";
import { ReactComponent as ShareIcon } from "../../assets/icons/shareicon.svg";
import SpinnerComponent from "../atoms/SpinnerComponent";
import ErrorText from "../atoms/ErrorText";

const CrewNoticeDetailTemplate: React.FC = () => {
  const { crewId, noticeId } = useParams<{
    crewId: string;
    noticeId: string;
  }>();

  const requestDto: CrewNoticeDetailRequestDto = {
    crewId: Number(crewId),
    noticeId: Number(noticeId),
  };

  const queryClient = useQueryClient();

  // Fetch the notice details
  const {
    data: noticeData,
    isLoading: noticeLoading,
    error: noticeError,
  } = useQuery<CrewNoticeDetailResponseDto>(
    ["noticeDetail", requestDto],
    () => getCrewNoticeDetail(requestDto)
  );

  // Fetch crew information
  const {
    data: crewInfo,
    isLoading: crewLoading,
    error: crewError,
  } = useQuery(
    ["crewInfo", crewId],
    () => getCrewInfo({ crewId: Number(crewId) }),
    {
      enabled: !!noticeData, // Only fetch crew info if notice data is available
    }
  );

  const [likes, setLikes] = useState<number>(noticeData?.heartCount || 0);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(
    noticeData?.isHearted || false
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (noticeData) {
      setLikes(noticeData.heartCount);
      setIsHeartedState(noticeData.isHearted);
    }
  }, [noticeData]);

  useEffect(() => {
    if (!(window as any).Kakao.isInitialized()) {
      (window as any).Kakao.init("YOUR_APP_KEY");
    }
  }, []);

  const likeMutation = useMutation(registerPostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["noticeDetail", requestDto]);
      setLikes((prevLikes) => prevLikes + 1);
      setIsHeartedState(true);
    },
    onError: (error) => {
      console.error("좋아요 처리 중 오류가 발생했습니다:", error);
    },
  });

  const unlikeMutation = useMutation(deletePostHeart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["noticeDetail", requestDto]);
      setLikes((prevLikes) => prevLikes - 1);
      setIsHeartedState(false);
    },
    onError: (error) => {
      console.error("좋아요 취소 처리 중 오류가 발생했습니다:", error);
    },
  });

  const handleLike = () => {
    if (isHeartedState) {
      unlikeMutation.mutate(Number(noticeId));
    } else {
      likeMutation.mutate(Number(noticeId));
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
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
        title: noticeData?.title,
        description: noticeData?.content.substring(0, 100) + "...",
        imageUrl: noticeData?.postImages?.[0] || noticeData?.profileImage || "",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "View Notice",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  if (noticeLoading || crewLoading) {
    return <SpinnerComponent />;
  }

  if (noticeError || crewError) {
    return <ErrorText text="데이터를 로드하는데 오류가 발생했습니다." />;
  }

  if (!noticeData) {
    return <div>No data available</div>;
  }

  const crewName = crewInfo?.crewName || noticeData.authorName;
  const profileImage = crewInfo?.mainLogo || noticeData.profileImage;

  const timeAgo = formatDistanceToNow(parseISO(noticeData.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={noticeData.title} />
      </header>
      <div className="w-full">
        <div className="flex items-center mx-2">
          <UserProfileBarNoMenu
            profileImage={profileImage}
            username={crewName}
            timeAgo={timeAgo}
          />
          <div className="">
            <EditDeleteDropdownOrganism
              type="NOTICE"
              idData={Number(noticeId)}
              idData2={Number(crewId)}
            />
          </div>
        </div>
        {noticeData.postImages && noticeData.postImages.length > 0 ? (
          <Carousel
            showThumbs={false}
            showIndicators={true}
            showStatus={false}
            infiniteLoop={false}
            autoPlay={false}
          >
            {noticeData.postImages.map((image, index) => (
              <div key={image}>
                <img
                  src={image}
                  alt={`Notice ${index}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          profileImage && (
            <div className="flex justify-center">
              <img
                src={profileImage}
                alt="Profile"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )
        )}
        <div className="flex items-center mt-2">
          <button onClick={handleLike} className="flex items-center ml-3">
            <img
              src={isHeartedState ? filledFire : emptyFire}
              alt="fire-icon"
              className={`w-7 ${isAnimating ? "animate" : ""}`}
            />
          </button>
          <button onClick={handleShare} className="flex ml-auto mr-3">
            <ShareIcon />
          </button>
        </div>
        <div className="text-md ml-3 mt-2">{likes}명이 공감했어요!</div>
        <div className="mt-1 mx-3">
          <div>
            <span className="font-bold">{crewName}{" "}</span>
            {noticeData.content}
          </div>
        </div>
      </div>
    </>
  );
};

export default CrewNoticeDetailTemplate;
