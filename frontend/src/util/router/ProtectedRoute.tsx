import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
import { refreshToken } from "../../apis/api/authorization";

const ProtectedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      refreshToken().catch(() => navigate("/login"));
    }
  }, [isAuthenticated, loading, navigate]);

  if (!isAuthenticated) return <>스플레쉬</>;
  return <Outlet />;
};

export default ProtectedRoute;
