import React from "react";

type Title = {
  text: string;
  onClick?: () => void;
};

const MediumTitle: React.FC<Title> = (props) => {
  return (
    <p
      className="ms-4 text-xl font-black tracking-tighter"
      onClick={props.onClick}
    >
      {props.text}
    </p>
  );
};

export default MediumTitle;
