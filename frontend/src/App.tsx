import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBarOrganism from "./components/organisms/BottomBarOrganism";

const App: React.FC = () => {
  // 현 위치 파악 함수
  const location = useLocation();

  // 제외할 페이지
  const hideBottomBarRoutes = ["/login", "/join", "/find-password"];
  const shouldHideBottomBar = hideBottomBarRoutes.includes(location.pathname);

  return (
    <div className="mx-auto w-full max-w-[550px]">
      <Outlet />
      {!shouldHideBottomBar && (
        <BottomBarOrganism current={location.pathname} />
      )}{" "}
    </div>
  );
};

export default App;
