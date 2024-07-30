import React from "react";

type ContentData = {
  data: number;
};

const SmallPaceContent: React.FC<ContentData> = (props) => {
  return (
    <>
      <p className="font-medium">{props.data}분</p>
    </>
  );
};

export default SmallPaceContent;
