import React, { useState } from "react";
import CrewInfoOrganism from "../organisms/CrewInfoOrganism";
import CrewNoticeOrganism from "../organisms/CrewNoticeOrganism";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import ThreeToTwoImageMolecule from "../molecules/Image/ThreeToTwoImageMolecule";
import crewbanner from "../../assets/images/crewinbanner.png";
import BackHeaderMediumOrganism from "../organisms/BackHeaderMediumOrganism";
import CrewAlbumOrganism from "../organisms/CrewAlbumOrganism";
import CrewHeaderBarOrganism from "../organisms/CrewHeaderBarOrganism";

import one from "../../assets/images/alarm-clockblack.png";
import two from "../../assets/images/alarm-clockblack.png";
import three from "../../assets/images/alarm-clockblack.png";
import four from "../../assets/images/alarm-clockblack.png";
import five from "../../assets/images/alarm-clockblack.png";
import six from "../../assets/images/alarm-clockblack.png";
import seven from "../../assets/images/alarm-clockblack.png";
import eight from "../../assets/images/alarm-clockblack.png";
import nine from "../../assets/images/alarm-clockblack.png";
import ten from "../../assets/images/alarm-clockblack.png";

const CrewDetailTemplate: React.FC = () => {
  const [curruntTab, setCurrentTab] = useState<string>("정보");

  const notices = [
    { role: "Captain", title: "첫번째 공지", date: "2024.07.23" },
    { role: "Pacer", title: "두번째 공지", date: "2024.07.24" },
  ];

  const infos = {
    crewname: "CAUON",
    captain: "이예령씨",
    slogan: "같이의 가치",
    area: "서울특별시 동작구",
    birth: "2018년 4월 3일",
    people: "100",
    introduction: "중앙대학교 중앙동아리 러닝크루입니다.",
  };

  const photos = [one, two, three, four, five, six, seven, eight, nine, ten];

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const renderTab = () => {
    switch (curruntTab) {
      case "공지사항":
        return <CrewNoticeOrganism notices={notices} />;
      case "정보":
        return <CrewInfoOrganism {...infos} />;
      case "사진첩":
        return <CrewAlbumOrganism photos={photos} />;
      default:
        return <CrewInfoOrganism {...infos} />;
    }
  };

  const texts = ["정보", "공지사항", "사진첩"];

  return (
    <>
      <CrewHeaderBarOrganism />
      <header>
        <BackHeaderMediumOrganism text={infos.crewname} />
      </header>
      <ThreeToTwoImageMolecule src={crewbanner} alt="crewbanner" />
      <div className="pb-20">
        <NavTabMolecule texts={texts} onTabClick={handleTabClick} />
        {renderTab()}
      </div>
    </>
  );
};

export default CrewDetailTemplate;
