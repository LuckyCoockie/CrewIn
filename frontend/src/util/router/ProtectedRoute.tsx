import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import store, { RootState } from "../../modules";
import { refreshAccessToken } from "../../modules/reducers/auth";

const ProtectedRoute = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  // TODO : true 빼기
  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      store.dispatch(refreshAccessToken()).catch(() => navigate("/login"));
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
