import React from "react";
import MediumTitle from "../../atoms/Title/MediumTitle";

type Text = {
  text: string;
  onClick?: () => void;
};

const MediumTitleMolecule: React.FC<Text> = (props) => {
  return (
      <MediumTitle text={props.text} onClick={props.onClick} />
  );
};

export default MediumTitleMolecule;
