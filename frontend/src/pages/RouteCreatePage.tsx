import RouteCreateTemplate from "../components/templates/RouteCreateTemplate.tsx";
import useGeolocation from "../util/geolocation/gelocation.ts";
import { NaverMapProvider } from "../util/maps/naver_map/context.tsx";

const RouteCreatePage: React.FC = () => {
  const { location } = useGeolocation();

  return (
    <>
      {location && (
        <NaverMapProvider>
          <RouteCreateTemplate
            initPosition={location}
            onSave={({ title, markers, polylines, length, image }) =>
              console.log({
                title: title,
                info: JSON.stringify({
                  markers: markers.map((point) => [
                    point.latitude,
                    point.longitude,
                  ]),
                  polylines: polylines.map((polyline) =>
                    polyline.map((point) => [point.latitude, point.longitude])
                  ),
                }),
                length: length,
                image: image,
              })
            }
          />
        </NaverMapProvider>
      )}
    </>
  );
};

export default RouteCreatePage;
