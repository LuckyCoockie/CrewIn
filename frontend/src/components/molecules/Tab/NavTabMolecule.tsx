import React from "react";
import NavButton from "../../atoms/Button/NavButton";

type Titles = {
  texts: string[];
};

const NavTabMolecule: React.FC<Titles> = ({ texts }) => {

  return (
    <>
      <div>
        {texts.map((text, index) => (
          <NavButton text={text} key={index} devide={texts.length}/>
        ))}
      </div>
    </>
  );
};

export default NavTabMolecule;
