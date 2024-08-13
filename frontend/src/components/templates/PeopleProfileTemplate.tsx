import React from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import PeopleRecordInfoOrganism from "../organisms/people/PeopleRecordInfoOrganism";
import PeopleAlbumOrganism from "../organisms/people/PeopleAlbumOrganism";
import { getPeopleProfileInfo, ProfileDto } from "../../apis/api/mypage";
import { useNavigate, useParams } from "react-router";
import { createSearchParams } from "react-router-dom";
import SpinnerComponent from "../atoms/SpinnerComponent";
import ErrorText from "../atoms/ErrorText";

const PeopleProfileTemplate: React.FC = () => {
  console.log("여기는 남의 페이지");
  const { memberId } = useParams<{ memberId: string }>();
  console.log(memberId);

  const navigate = useNavigate();
  const numericMemberId = Number(memberId);
  // React Query를 사용하여 데이터를 가져옴
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery<ProfileDto>(["myProfile", numericMemberId], () =>
    getPeopleProfileInfo(numericMemberId)
  );

  // 로딩 상태 처리
  if (isProfileLoading) {
    return <SpinnerComponent />;
  }

  // 에러 상태 처리
  if (isProfileError) {
    return <ErrorText text="데이터를 로드하는데 오류가 발생했습니다." />;
  }

  // 데이터가 존재하지 않을 경우의 처리
  if (!profileData) {
    return <div>No data available</div>;
  }
  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={profileData.nickname} />
      </header>
      <PeopleRecordInfoOrganism profileData={profileData} />
      <div>
        <PeopleAlbumOrganism
          onItemClicked={async (pageNo, postId) =>
            navigate(
              `/profile/${memberId}/gallery?${createSearchParams({
                pageNo: pageNo.toString(),
                postId: postId.toString(),
              })}`
            )
          }
        />
      </div>
    </>
  );
};

export default PeopleProfileTemplate;
