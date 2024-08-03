import React from "react";
import HomeTabMolecule from "../molecules/Tab/HomeTabMolecule";
import SessionTabMolecule from "../molecules/Tab/SessionTabMolecule";
import ProfileTabMolecule from "../molecules/Tab/ProfileTabMolecule";
import CrewTabMolecule from "../molecules/Tab/CrewTabMolecule";
import { useNavigate } from "react-router-dom";
import "../../styles/buttonstyle.css";

type Current = {
  current: string;
};

const BottomBarOrganism: React.FC<Current> = (props) => {
  const navigator = useNavigate();

  const currentTab = props.current.split(/[?/]/)[1];

  const selectedTab = (tab: string) => {
    navigator(`/${tab}`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[550px] bg-white fixed bottom-0 left-0 right-0 flex justify-center items-center border-gray-200 border-t z-50">
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
            onClick={() => selectedTab("session?status=active")}
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
