import { useState, useEffect } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

type GeolocationError = {
  code: number;
  message: string;
};

const useGeolocation = () => {
  const [location, setCoord] = useState<Location | undefined>();
  const [error, setError] = useState<GeolocationError | null>(null);

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const location = { latitude, longitude };
    setCoord(location);
    setError(null);
  };

  const handleError = (err: GeolocationPositionError) => {
    setError({ code: err.code, message: err.message });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { location, error };
};

export default useGeolocation;
