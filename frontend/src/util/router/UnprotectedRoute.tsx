import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";

const UnprotectedRoute = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  // TODO : false 빼기
  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default UnprotectedRoute;
