import React from "react";
import MediumTitleMolecule from "../molecules/Title/MediumTitleMolecule";
import BackButton from "../atoms/Button/BackButton";

type Text = {
  text: string;
};

const BackHeaderMediumOrganism: React.FC<Text> = (props) => {
  return (
    <>
        <div>
          <BackButton />
        </div>
        <div className="flex items-center justify-center pb-1">
          <MediumTitleMolecule text={props.text} />
        </div>
    </>
  );
};

export default BackHeaderMediumOrganism;
