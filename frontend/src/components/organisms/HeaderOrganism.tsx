import React from "react";
import LargeTitleMolecule from "../molecules/LargeTitleMolecule";

type Text = {
  text: string;
};

const HeaderOrganism: React.FC<Text> = (props) => {
  return <LargeTitleMolecule text={props.text} />;
};

export default HeaderOrganism;
