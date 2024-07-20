import React, { useState } from "react";
import HomeTabMolecule from "../molecules/HomeTabMolecule";
import SessionTabMolecule from "../molecules/SessionTabMolecule";
import ProfileTabMolecule from "../molecules/ProfileTabMolecule";
import CrewTabMolecule from "../molecules/CrewTabMolecule";
import { useNavigate } from "react-router-dom";
import "../../styles/buttonstyle.css";

type Tab = "home" | "session" | "crew" | "profile";

const BottomBarOrganism: React.FC = () => {
  const [currentTab, setcurrentTab] = useState<Tab>("home");
  const navigator = useNavigate();

  const selectedTab = (tab: Tab) => {
    setcurrentTab(tab);
    navigator(`/${tab}`);
    console.log(tab);
  };

  return (
    <>
      <div className="flex justify-center items-center border-gray-200 border-t">
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
