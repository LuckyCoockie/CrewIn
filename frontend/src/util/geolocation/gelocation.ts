import { useState, useEffect } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

type GeolocationError = {
  code: number;
  message: string;
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [error, setError] = useState<GeolocationError | null>(null);

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const location = { latitude, longitude };
    setLocation(location);
    setError(null);
  };

  const handleError = (err: GeolocationPositionError) => {
    setError({ code: err.code, message: err.message });
  };

  const refetch = () => {
    setError(null);
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          setError({ code: -1, message: permissionStatus.state });
        } else {
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        }
      });
  };

  useEffect(refetch, []);

  return { location, error, refetch };
};

export const useWatchGeolocation = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [error, setError] = useState<GeolocationError | null>(null);
  const [id, setId] = useState<number | undefined>();

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const location = { latitude, longitude };
    setLocation(location);
    setError(null);
  };

  const handleError = (err: GeolocationPositionError) => {
    setError({ code: err.code, message: err.message });
  };

  const watch = () => {
    clear();
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          setError({ code: -1, message: permissionStatus.state });
        } else {
          setId(
            navigator.geolocation.watchPosition(handleSuccess, handleError)
          );
        }
      });
  };

  const clear = () => {
    if (id) navigator.geolocation.clearWatch(id);
    setError(null);
  };

  return { location, error, watch, clear };
};

export default { useGeolocation, useWatchGeolocation };
