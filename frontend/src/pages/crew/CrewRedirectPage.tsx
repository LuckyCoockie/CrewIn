import { useEffect } from "react";
import { getMyCrews } from "../../apis/api/mycrew";
import { Navigate, useNavigate } from "react-router";

const CrewRedirectPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    getMyCrews().then((response) => {
      if (response.crews.length > 0) {
        navigate(`/crew/detail/${response.crews[0].crewId}`, { replace: true });
      }
    });
  }, [navigate]);
  return <Navigate to={"/crew/search"} replace />;
};

export default CrewRedirectPage;
