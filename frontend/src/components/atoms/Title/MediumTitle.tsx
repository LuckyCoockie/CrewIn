import React from "react";

type Title = {
  text: string;
};

const MediumTitle: React.FC<Title> = (props) => {
  return <p className="ms-4 text-xl font-black tracking-tighter ">{props.text}</p>;
};

export default MediumTitle;
