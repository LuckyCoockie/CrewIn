import React from "react";

type ContentData = {
  data: string;
};

const SmallContent: React.FC<ContentData> = (props) => {
  return (
    <>
      <p className="font-medium">{props.data}</p>
    </>
  );
};

export default SmallContent;
