import React from "react";
import { useQuery } from "react-query";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import PeopleRecordInfoOrganism from "../organisms/people/PeopleRecordInfoOrganism";
import PeopleAlbumOrganism from "../organisms/people/PeopleAlbumOrganism";
import { getMyProfileInfo, ProfileDto } from "../../apis/api/mypage";
import { useParams } from "react-router";

const PeopleProfileTemplate: React.FC = () => {
  console.log("여기는 남의 페이지");
  const { memberId } = useParams<{ memberId: string }>();
  console.log(memberId);

  const numericMemberId = memberId ? Number(memberId) : null;
  // React Query를 사용하여 데이터를 가져옴
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery<ProfileDto>(["myProfile", numericMemberId], () =>
    getMyProfileInfo(numericMemberId)
  );

  // 로딩 상태 처리
  if (isProfileLoading) {
    return <div>Loading...</div>;
  }

  // 에러 상태 처리
  if (isProfileError) {
    return <div>Error loading data</div>;
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
        <PeopleAlbumOrganism />
      </div>
    </>
  );
};

export default PeopleProfileTemplate;
