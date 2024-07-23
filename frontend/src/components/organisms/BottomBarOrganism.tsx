import React, { useState } from "react";
import HomeTabMolecule from "../molecules/HomeTabMolecule";
import SessionTabMolecule from "../molecules/SessionTabMolecule";
import ProfileTabMolecule from "../molecules/ProfileTabMolecule";
import CrewTabMolecule from "../molecules/CrewTabMolecule";
import { useNavigate } from "react-router-dom";
import "../../styles/buttonstyle.css";

type Current = {
  current: string;
};

const BottomBarOrganism: React.FC<Current> = (props) => {
  const [currentTab, setcurrentTab] = useState(props.current.split("/")[1]);
  const navigator = useNavigate();
  console.log(currentTab);

  const selectedTab = (tab: string) => {
    setcurrentTab(tab);
    navigator(`/${tab}`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[550px] bg-white fixed bottom-0 left-0 right-0 flex justify-center items-center border-gray-200 border-t">
        <div className="w-full h-full button">
          <HomeTabMolecule
            name="Home"
            tab={currentTab === "home"}
            onClick={() => selectedTab("home")}
          />
        </div>
        <div className="w-full h-full button">
          <SessionTabMolecule
            name="Session"
            tab={currentTab === "session"}
            onClick={() => selectedTab("session")}
          />
        </div>
        <div className="w-full h-full button">
          <CrewTabMolecule
            name="Crew"
            tab={currentTab === "crew"}
            onClick={() => selectedTab("crew")}
          />
        </div>
        <div className="w-full h-full button">
          <ProfileTabMolecule
            name="Profile"
            tab={currentTab === "profile"}
            onClick={() => selectedTab("profile")}
          />
        </div>
      </div>
    </>
  );
};

export default BottomBarOrganism;
