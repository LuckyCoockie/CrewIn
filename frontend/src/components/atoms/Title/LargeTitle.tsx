import React from "react";

type Title = {
  text: string;
};

const LargeTitle: React.FC<Title> = (props) => {
  return <p className="text-2xl font-black tracking-tighter">{props.text}</p>;
};

export default LargeTitle;
