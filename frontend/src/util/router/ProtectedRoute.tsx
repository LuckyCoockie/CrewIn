import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
import { refreshToken } from "../../apis/api/authorization";
import SplashPage from "./SplashPage";

const ProtectedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  console.log(loading, isAuthenticated);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      refreshToken().catch(() => navigate("/login"));
    }
    if (!loading && !isAuthenticated) {
      refreshToken().catch(() => navigate("/login"));
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) return <SplashPage />;
  return <Outlet />;
};

export default ProtectedRoute;
