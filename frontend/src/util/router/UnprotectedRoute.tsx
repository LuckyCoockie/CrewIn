import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";

const UnprotectedRoute = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  useEffect(() => {
    // TODO : 로그인 되어있으면 login page로 못가게 하기...
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default UnprotectedRoute;
