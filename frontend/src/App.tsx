import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBarOrganism from "./components/organisms/BottomBarOrganism";

const App: React.FC = () => {
  // 현 위치 파악 함수
  const location = useLocation();

  // 제외할 페이지
  const hideBottomBarRoutes = ["/login"];
  const shouldHideBottomBar = hideBottomBarRoutes.includes(location.pathname);

  return (
    <>
      <header>
        <h1>Crew-In</h1>
      </header>
      <main className="">
        <Outlet />
      </main>
      {!shouldHideBottomBar && <BottomBarOrganism />}{" "}
    </>
  );
};

export default App;
