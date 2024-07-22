import React from "react";

type ContentData = {
  data: string;
};

const SmallContent: React.FC<ContentData> = (props) => {
  return <>
  <p>{props.data}</p>
  </>;
};

export default SmallContent;
