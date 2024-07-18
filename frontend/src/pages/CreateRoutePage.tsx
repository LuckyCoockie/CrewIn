import React, { useEffect, useState } from "react";
import { Coordinate } from "../util/maps/geolocation/Coordinate";
import { NaverMapProvider } from "../util/maps/naver_map/context";
import NaverMap from "../util/maps/naver_map/NaverMap";

export const CreateRoutePage: React.FC = () => {
  const [coord, setCoord] = useState<Coordinate>();

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const location: Coordinate = { latitude: latitude, longitude: longitude };
    setCoord(location);
  };

  // 에러 콜백
  const handleError = (err: GeolocationPositionError) => {
    console.log(err);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return (
    <NaverMapProvider>
      {coord && <NaverMap lng={coord.longitude} lat={coord.latitude} />}
    </NaverMapProvider>
  );
};
