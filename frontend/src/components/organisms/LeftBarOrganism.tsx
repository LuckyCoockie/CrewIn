import React, { useEffect } from "react";
import HomeTabMolecule from "../molecules/Tab/HomeTabMolecule";
import SessionTabMolecule from "../molecules/Tab/SessionTabMolecule";
import ProfileTabMolecule from "../molecules/Tab/ProfileTabMolecule";
import CrewTabMolecule from "../molecules/Tab/CrewTabMolecule";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buttonstyle.css";
import { ReactComponent as CrewinLogo } from "../../assets/icons/crewinlogo.svg";
import { ReactComponent as SettingIcon } from "../../assets/icons/setting.svg";
import { ReactComponent as LogoutIcon } from "../../assets/icons/logout.svg";
import { clearAuth } from "../../util/auth";
import { logout } from "../../apis/api/logout";
import SearchTabMolecule from "../molecules/Tab/SearchTabMolecule";
import AlarmTabMolecule from "../molecules/Tab/AlarmTabMolecule";

type Current = {
  current: string;
};

const LeftBarOrganism: React.FC<Current> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBottomBarRoutes = [
    /^\/home$/,
    /^\/session\??[^/]*$/,
    /^\/crew(\/(search(\?)?|detail\/(?![^/]+\/notice).*)?)?$/,
    /^\/profile$/,
    /^\/alarm$/,
    /^\/searchuser$/,
  ];

  const isTab = showBottomBarRoutes.some((pattern) =>
    pattern.test(location.pathname)
  );
  const currentTab = props.current.split(/[?/]/)[1];

  const onTabSelected = (tab: string) => {
    if (tab != currentTab || props.current.match(/^\/profile\/[^/]+$/)) {
      navigate(`/${tab}`);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      <div className="mx-auto h-full bg-background fixed top-0 bottom-0 left-0 flex flex-col justify-between border-gray-200 border-r z-50">
        <div>
          <div className="flex items-center lg:ms-2 py-2 py-7 p-4 lg:pr-[100px]">
            <CrewinLogo className="hidden lg:block fill-letter" />
          </div>
          <div className="w-full">
            <HomeTabMolecule
              name="Home"
              tab={isTab && currentTab === "home"}
              onClick={() => onTabSelected("home")}
            />
          </div>
          <div className="w-full">
            <AlarmTabMolecule
              name={"Alarm"}
              tab={isTab && currentTab === "alarm"}
              onClick={() => {
                navigate("alarm");
              }}
            />
          </div>
          <div className="w-full">
            <SearchTabMolecule
              name="Search"
              tab={isTab && currentTab === "searchuser"}
              onClick={() => onTabSelected("searchuser")}
            />
          </div>
          <div className="w-full">
            <SessionTabMolecule
              name="Session"
              tab={isTab && currentTab === "session"}
              onClick={() => onTabSelected("session?status=active")}
            />
          </div>
          <div className="w-full">
            <CrewTabMolecule
              name="Crew"
              tab={isTab && currentTab === "crew"}
              onClick={() => onTabSelected("crew")}
            />
          </div>
          <div className="w-full">
            <ProfileTabMolecule
              name="Profile"
              tab={isTab && currentTab === "profile"}
              onClick={() => onTabSelected("profile")}
            />
          </div>
        </div>
        <div className="py-3 border-t">
          <div className="w-full">
            <div
              className="p-7 lg:pr-10 flex flex-col lg:flex-row items-center py-2 lg:py-4 hover:scale-105 transform active:scale-90 transition cursor-pointer button"
              onClick={() => navigate("/info")}
            >
              <SettingIcon />
              <p className="text-center text-xs lg:text-base font-bold lg:pl-2">
                {"Setting"}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div
              className="p-7 lg:pr-10 flex flex-col lg:flex-row items-center py-2 lg:py-4 hover:scale-105 transform active:scale-90 transition cursor-pointer button"
              onClick={() => logout().then(() => clearAuth())}
            >
              <LogoutIcon />
              <p className="text-center text-xs lg:text-base font-bold lg:pl-2">
                {"Logout"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftBarOrganism;
