import React from "react";

type Title = {
  text: string;
};

const LargeTitle: React.FC<Title> = (props) => {
  return <p className="text-[24px] font-black">{props.text}</p>;
};

export default LargeTitle;
