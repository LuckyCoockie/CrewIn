import React from "react";
import NavButton from "../../atoms/Button/NavButton";

interface NavTabMoleculeProps {
  texts: string[];
  onTabClick: (tab: string) => void;
  currentTab: string; // 현재 선택된 탭 정보
}

const NavTabMolecule: React.FC<NavTabMoleculeProps> = ({
  texts,
  onTabClick,
  currentTab,
}) => {
  return (
    <div>
      {texts.map((text, index) => (
        <NavButton
          text={text}
          key={index}
          devide={texts.length}
          isActive={currentTab === text} // 현재 탭인지 확인
          onClick={() => onTabClick(text)}
        />
      ))}
    </div>
  );
};

export default NavTabMolecule;
