import React from "react";
import MediumTitle from "../../atoms/Title/MediumTitle";

type Text = {
  text: string;
};

const MediumTitleMolecule: React.FC<Text> = (props) => {
  return <MediumTitle text={props.text} />;
};

export default MediumTitleMolecule;
