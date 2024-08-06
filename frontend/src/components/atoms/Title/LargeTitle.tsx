import React from "react";

type Title = {
  text: string;
};

const LargeTitle: React.FC<Title> = (props) => {
  return (
    <p className="text-xl font-black tracking-tighter truncate">{props.text}</p>
  );
};

export default LargeTitle;
