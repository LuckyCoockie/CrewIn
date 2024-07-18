import RouteCreateTemplate from "../components/templates/RouteCreateTemplate.tsx";
import useGeolocation from "../util/geolocation/gelocation.ts";

const RouteCreatePage: React.FC = () => {
  const {location} = useGeolocation();

  return (
    <>
      {location && (
        <RouteCreateTemplate initPosition={location} onSave={console.log} />
      )}
    </>
  );
};

export default RouteCreatePage;
