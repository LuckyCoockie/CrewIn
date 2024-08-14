import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
// import { refreshToken } from "../../apis/api/authorization";
import SplashPage from "./SplashPage";
import BottomBarOrganism from "../../components/organisms/BottomBarOrganism";
import useIsMobile from "../windowSize/useIsMobile";
import LeftBarOrganism from "../../components/organisms/LeftBarOrganism";

const ProtectedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // refreshToken().catch(() =>
      //   navigate("/login", { state: { navigateFrom: location }, replace: true })
      // );
    }
  }, [isAuthenticated, loading, location, navigate]);

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
  const { isMobile } = useIsMobile();

  if (loading || !isAuthenticated) return <SplashPage />;

  return (
    <div className={"md:ml-[97.93px] lg:ml-[176px]"}>
      {!loading && !isMobile && <LeftBarOrganism current={location.pathname} />}
      <div className="mx-auto w-full max-w-[500px]">
        <Outlet />
      </div>
      {!loading && shouldShowBottomBar && isMobile && (
        <BottomBarOrganism current={location.pathname} />
      )}
    </div>
  );
};

export default ProtectedRoute;
