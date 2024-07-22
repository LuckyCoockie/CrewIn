import RouteCreateTemplate from "../components/templates/RouteCreateTemplate.tsx";
import useGeolocation from "../util/geolocation/gelocation.ts";
import { NaverMapProvider } from "../util/maps/naver_map/context.tsx";

const RouteCreatePage: React.FC = () => {
  const { location } = useGeolocation();

  return (
    <>
      {location && (
        <NaverMapProvider>
          <RouteCreateTemplate initPosition={location} onSave={console.log} />
        </NaverMapProvider>
      )}
    </>
  );
};

export default RouteCreatePage;
