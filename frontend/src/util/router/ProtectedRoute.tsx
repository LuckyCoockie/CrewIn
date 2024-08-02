import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";

const ProtectedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]) || true;

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, loading, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
