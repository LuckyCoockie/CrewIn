import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";
import { checkAuth } from "../auth";

const UnprotectedRoute = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const navigate = useNavigate();
  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (isAuthenticated || checkAuth()) {
      navigate(location.state?.navigateFrom ?? "/");
    }
  }, [isAuthenticated, location.state?.navigateFrom, navigate]);

  return <Outlet />;
};

export default UnprotectedRoute;
