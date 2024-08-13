import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
import { checkAuth } from "../auth";
import SplashPage from "./SplashPage";

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

  if (loading) return <SplashPage />;
  return (
    <div className="mx-auto w-full max-w-[500px]">
      <Outlet />
    </div>
  );
};

export default UnprotectedRoute;
