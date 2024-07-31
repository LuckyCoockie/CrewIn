import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../modules";

const ProtectedRoute = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const isAuthenticated = useMemo(() => accessToken !== null, [accessToken]);

  console.log(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
