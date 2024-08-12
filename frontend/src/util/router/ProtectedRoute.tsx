import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
import { refreshToken } from "../../apis/api/authorization";
import SplashPage from "./SplashPage";

const ProtectedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      refreshToken().catch(() =>
        navigate("/login", { state: { navigateFrom: location }, replace: true })
      );
    }
  }, [isAuthenticated, loading, location, navigate]);

  if (loading || !isAuthenticated) return <SplashPage />;
  return <Outlet />;
};

export default ProtectedRoute;
