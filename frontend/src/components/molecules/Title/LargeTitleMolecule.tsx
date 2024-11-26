import React from "react";
import LargeTitle from "../../atoms/Title/LargeTitle";

type Text = {
  text: string;
};

const LargeTitleMolecule: React.FC<Text> = (props) => {
  return <LargeTitle text={props.text} />;
};

export default LargeTitleMolecule;
