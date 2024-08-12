import React, { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBarOrganism from "./components/organisms/BottomBarOrganism";
import PullToRefresh from "./util/ptr/PullToRefersh.tsx";

const standalone = window.matchMedia("(display-mode: standalone)").matches;
const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

const App: React.FC = () => {
  // 현 위치 파악 함수
  const location = useLocation();

  // 바텀바를 그릴 페이지
  const showBottomBarRoutes = [
    /^\/home$/,
    /^\/session\??[^/]*$/,
    /^\/crew(\/(search(\?)?|detail\/(?![^/]+\/notice).*)?)?$/,
    /^\/profile$/,
  ];
  const shouldShowBottomBar = showBottomBarRoutes.some((pattern) =>
    pattern.test(location.pathname)
  );

  const ref = useRef<HTMLDivElement>(null);
  const onRefresh = async () => {
    if (standalone && isIOS) window.location.reload();
  };

  return (
    <div className="mx-auto w-full max-w-[550px]" ref={ref}>
      {standalone && isIOS && <PullToRefresh el={ref} onRefresh={onRefresh} />}
      <Outlet />
      {shouldShowBottomBar && (
        <BottomBarOrganism current={location.pathname} />
      )}
    </div>
  );
};

export default App;
