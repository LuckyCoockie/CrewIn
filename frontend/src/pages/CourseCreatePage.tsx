import { createCourse } from "../apis/api/course.ts";
import { uploadImage } from "../apis/api/presigned.ts";
import CourseCreateTemplate from "../components/templates/CourseCreateTemplate.tsx";
import useGeolocation from "../util/geolocation/gelocation.ts";
import { NaverMapProvider } from "../util/maps/naver_map/context.tsx";
import { Point } from "../util/maps/tmap/apis/api/directionApi.ts";
import { reversGeocodingApi } from "../util/maps/tmap/apis/api/geocodeApi.ts";

const CourseCreatePage: React.FC = () => {
  const { location } = useGeolocation();

  const parseInfo = async (markers: Point[], polylines: Point[][]) => {
    return JSON.stringify({
      markers: markers.map((point) => [point.latitude, point.longitude]),
      polylines: polylines!.map((polyline) =>
        polyline.map((point) => [point.latitude, point.longitude])
      ),
    });
  };

  const parseArea = async (point: Point) => {
    const address = await reversGeocodingApi({
      lat: point.latitude,
      lon: point.longitude,
      addressType: "A10",
      newAddressExtend: "Y",
    });

    return `${address.addressInfo.city_do} ${address.addressInfo.gu_gun} ${address.addressInfo.legalDong}`;
  };

  return (
    <>
      {location && (
        <NaverMapProvider>
          <CourseCreateTemplate
            initPosition={location}
            onSave={async ({ title, markers, polylines, length, image }) => {
              const [info, area, imageUrl] = await Promise.all([
                parseInfo(markers, polylines!),
                parseArea(markers[0]),
                uploadImage(image!),
              ]);

              createCourse({
                name: title,
                info: info,
                length: length!,
                thumbnailImage: imageUrl,
                area: area,
              });
            }}
          />
        </NaverMapProvider>
      )}
    </>
  );
};

export default CourseCreatePage;
