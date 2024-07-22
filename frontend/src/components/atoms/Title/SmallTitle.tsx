import React from "react";

type TitleData = {
  data: string;
};

const SmallTitle: React.FC<TitleData> = (props) => {
  return (
    <>
      <p className="font-black">{props.data}</p>
    </>
  );
};

export default SmallTitle;
