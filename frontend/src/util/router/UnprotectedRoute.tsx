import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
import { checkAuth } from "../auth";
import SplashPage from "./SplashPage";
import PullToRefresh from "../../util/ptr/PullToRefersh.tsx";

const UnprotectedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  const navigate = useNavigate();
  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (isAuthenticated || checkAuth()) {
      navigate(location.state?.navigateFrom ?? "/", { replace: true });
    }
  }, [isAuthenticated, location.state?.navigateFrom, navigate]);

  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );

  const ref = useRef<HTMLDivElement>(null);
  const onRefresh = async () => {
    if (standalone && isIOS) window.location.reload();
  };

  if (loading) return <SplashPage />;

  return (
    <div className="mx-auto w-full max-w-[500px]" ref={ref}>
      <PullToRefresh el={ref} onRefresh={onRefresh} />
      <Outlet />
    </div>
  );
};

export default UnprotectedRoute;
