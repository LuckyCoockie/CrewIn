import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import PullToRefresh from "./util/ptr/PullToRefersh.tsx";

const standalone = window.matchMedia("(display-mode: standalone)").matches;
const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onRefresh = async () => {
    if (standalone && isIOS) window.location.reload();
  };

  return (
    <div className="items-center" ref={ref}>
      {standalone && isIOS && <PullToRefresh el={ref} onRefresh={onRefresh} />}
      <Outlet />
    </div>
  );
};

export default App;
