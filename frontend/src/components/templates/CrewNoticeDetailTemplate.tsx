import React, { useState } from "react";
import { useQuery } from "react-query";

import { useParams } from "react-router-dom";
import {
  getCrewNoticeDetail,
  CrewNoticeDetailRequestDto,
} from "../../apis/api/crewdetail";
import filledFire from "../../assets/images/filledfire.png";
import emptyFire from "../../assets/images/emptyfire.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import UserProfileBarNoMenu from "../molecules/UserProfileBarNoMenuMolecule";
import { Carousel } from "react-responsive-carousel";
import EditDeleteDropdownOrganism from "../organisms/EditDeleteDropdownOrganism";

const CrewNoticeDetailTemplate: React.FC = () => {
  const { crewId, noticeId } = useParams<{
    crewId: string;
    noticeId: string;
  }>();

  const requestDto: CrewNoticeDetailRequestDto = {
    crewId: Number(crewId),
    noticeId: Number(noticeId),
  };

  const {
    data: noticeData,
    isLoading,
    error,
  } = useQuery(["noticeDetail", requestDto], () =>
    getCrewNoticeDetail(requestDto)
  );

  const [likes, setLikes] = useState<number>(noticeData?.heartCount || 0);
  const [isHeartedState, setIsHeartedState] = useState<boolean>(
    noticeData?.isHearted || false
  );

  const handleLike = () => {
    setLikes((prevLikes) => (isHeartedState ? prevLikes - 1 : prevLikes + 1));
    setIsHeartedState(!isHeartedState);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!noticeData) {
    return <div>No data available</div>;
  }

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
        <div className="flex items-center">
          <UserProfileBarNoMenu
            profileImage={noticeData.profileImage}
            username={noticeData.authorName}
            timeAgo={timeAgo}
          />
          <EditDeleteDropdownOrganism
            type="NOTICE"
            idData={Number(noticeId)}
            idData2={Number(crewId)}
          />
        </div>
        <Carousel
          showThumbs={false}
          showIndicators={true}
          showStatus={false}
          infiniteLoop={false}
          autoPlay={false}
        >
          {noticeData.postImages?.map((image, index) => (
            <div key={image}>
              <img
                src={image}
                alt={`Notice ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Carousel>
        <div className="mt-2">
          <p>{noticeData.content}</p>
        </div>
        <div className="flex items-center mt-2">
          <button onClick={handleLike} className="flex items-center ml-3">
            <img
              src={isHeartedState ? filledFire : emptyFire}
              alt="fire-icon"
              className="w-7"
            />
          </button>
          <span className="text-md ml-1">{likes}명이 공감했어요!</span>
        </div>
        <div className="border-t border-gray-300 my-2"></div>
      </div>
    </>
  );
};

export default CrewNoticeDetailTemplate;
