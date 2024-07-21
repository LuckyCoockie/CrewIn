import React from "react";

type Title = {
  text: string;
};

const LargeTitle: React.FC<Title> = (props) => {
  return <p className="text-xl font-black">{props.text}</p>;
};

export default LargeTitle;
