import React from "react";

type ContentData = {
  data: number; // 초 단위 시간
};

const SmallPaceContent: React.FC<ContentData> = (props) => {
  // props.data를 분과 초로 변환
  const minutes = Math.floor(props.data / 60);
  const seconds = props.data % 60;

  return (
    <>
      <p className="font-medium">
        {minutes}분 {seconds}초
      </p>
    </>
  );
};

export default SmallPaceContent;
