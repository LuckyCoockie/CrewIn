import React, { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBarOrganism from "./components/organisms/BottomBarOrganism.tsx";
import PullToRefresh from "./util/ptr/PullToRefersh.tsx";
import LeftBarOrganism from "./components/organisms/LeftBarOrganism.tsx";
import useIsMobile from "./util/windowSize/useIsMobile.ts";

const standalone = window.matchMedia("(display-mode: standalone)").matches;
const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

const App: React.FC = () => {
  // 현 위치 파악 함수
  const location = useLocation();

  // 좌측바를 그리지 않을 페이지
  const showLeftBarRoutes = [/^\/login$/, /^\/join$/, /^\/find-password$/];
  const shouldNotShowLeftBar = !showLeftBarRoutes.some((pattern) =>
    pattern.test(location.pathname)
  );

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

  const { isMobile } = useIsMobile();

  return (
    <div className="items-center">
      {shouldNotShowLeftBar && !isMobile && (
        <LeftBarOrganism current={location.pathname} />
      )}
      <div className="md:ml-[97.93px] lg:ml-[176px]">
        <div className="mx-auto w-full max-w-[500px]" ref={ref}>
          {standalone && isIOS && (
            <PullToRefresh el={ref} onRefresh={onRefresh} />
          )}
          <Outlet />
          {shouldShowBottomBar && isMobile && (
            <BottomBarOrganism current={location.pathname} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
