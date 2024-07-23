import React from "react";
import NavButton from "../../atoms/Button/NavButton";

type Titles = {
  texts: string[];
  onTabClick: (tab: string) => void;
};

const NavTabMolecule: React.FC<Titles> = ({ texts, onTabClick }) => {
  return (
    <div>
      {texts.map((text, index) => (
        <NavButton
          text={text}
          key={index}
          devide={texts.length}
          onClick={() => onTabClick(text)}
        />
      ))}
    </div>
  );
};

export default NavTabMolecule;
