import React, { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBarOrganism from "./components/organisms/BottomBarOrganism";
import PullToRefresh from "./util/ptr/PullToRefersh.tsx";

const standalone = window.matchMedia("(display-mode: standalone)").matches;

const App: React.FC = () => {
  // 현 위치 파악 함수
  const location = useLocation();

  // 제외할 페이지
  const hideBottomBarRoutes = [
    /^\/login$/,
    /^\/join$/,
    /^\/find-password$/,
    /^\/info$/,
    /^\/course\/create$/,
    /^\/profile\/[^/]+$/, // /profile/:userId 만 포함하도록 설정
  ];
  const shouldHideBottomBar = hideBottomBarRoutes.some((pattern) =>
    pattern.test(location.pathname)
  );

  const ref = useRef<HTMLDivElement>(null);
  const onRefresh = async () => {
    if (standalone) window.location.reload();
  };

  return (
    <div className="mx-auto w-full max-w-[550px]" ref={ref}>
      <PullToRefresh el={ref} onRefresh={onRefresh} />
      <Outlet />
      {!shouldHideBottomBar && (
        <BottomBarOrganism current={location.pathname} />
      )}
    </div>
  );
};

export default App;
