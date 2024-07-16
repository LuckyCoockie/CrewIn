import React from "react";

const CrewCreatePage: React.FC = () => {
  return (
    <form action="">
      <p>
        {/* 크루명 */}
        <label htmlFor="crew_name">크루명</label>
        <input type="text" id="crew_name" />
      </p>
      <p>
        {/* 슬로건 */}
        <label htmlFor="slogan">슬로건</label>
        <input type="text" id="slogan" />
      </p>
      <p>
        {/* 활동 지역 */}
        <label htmlFor="area">활동 지역</label>
        <input type="text" id="area" />
      </p>
      <p>
        {/* 크루 생성일 */}
        <label htmlFor="crew_birth">크루 생성일</label>
        <input type="text" id="crew_birth" />
      </p>
      <p>
        {/* 소개 문구 */}
        <label htmlFor="introduction">소개 문구</label>
        <input type="text" id="introduction" />
      </p>
      <p>
        {/* 메인 로고 */}
        <label htmlFor="main_logo">메인 로고</label>
        <input type="text" id="main_logo" />
      </p>
      <p>
        {/* 서브 로고 */}
        <label htmlFor="sub_logo">서브 로고</label>
        <input type="text" id="sub_logo" />
      </p>
      <p>
        {/* 배너 */}
        <label htmlFor="banner">배너</label>
        <input type="text" id="banner" />
      </p>
    </form>
  );
};

export default CrewCreatePage;
