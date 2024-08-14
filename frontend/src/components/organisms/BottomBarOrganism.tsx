import React, { useEffect } from "react";
import HomeTabMolecule from "../molecules/Tab/HomeTabMolecule";
import SessionTabMolecule from "../molecules/Tab/SessionTabMolecule";
import ProfileTabMolecule from "../molecules/Tab/ProfileTabMolecule";
import CrewTabMolecule from "../molecules/Tab/CrewTabMolecule";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buttonstyle.css";

type Current = {
  current: string;
};

const BottomBarOrganism: React.FC<Current> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = props.current.split(/[?/]/)[1];

  const selectedTab = (tab: string) => {
    if (tab != currentTab) navigate(`/${tab}`);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      <div className="mx-auto w-full max-w-[500px] bg-white fixed bottom-0 left-0 right-0 flex justify-center items-center border-gray-200 border-t z-50">
        <div className="w-full h-full">
          <HomeTabMolecule
            name="Home"
            tab={currentTab === "home"}
            onClick={() => selectedTab("home")}
          />
        </div>
        <div className="w-full h-full">
          <SessionTabMolecule
            name="Session"
            tab={currentTab === "session"}
            onClick={() => selectedTab("session?status=active")}
          />
        </div>
        <div className="w-full h-full">
          <CrewTabMolecule
            name="Crew"
            tab={currentTab === "crew"}
            onClick={() => selectedTab("crew")}
          />
        </div>
        <div className="w-full h-full">
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
