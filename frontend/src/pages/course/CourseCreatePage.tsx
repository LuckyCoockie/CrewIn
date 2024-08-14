import { useNavigate } from "react-router";
import { createCourse } from "../../apis/api/course.ts";
import { uploadImage } from "../../apis/api/presigned.ts";
import CourseCreateTemplate from "../../components/templates/CourseCreateTemplate.tsx";
import { useGeolocation } from "../../util/geolocation/gelocation.ts";
import { NaverMapProvider } from "../../util/maps/naver_map/context.tsx";
import { Point } from "../../apis/api/tmap/directionApi.ts";
import { reversGeocodingApi } from "../../apis/api/tmap/geocodeApi.ts";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism.tsx";
import { RootState } from "../../modules/index.ts";
import { useSelector } from "react-redux";

const CourseCreatePage: React.FC = () => {
  const { location } = useGeolocation();
  const navigate = useNavigate();

  const encodeInfo = async (
    markers: { title: string; point: Point }[],
    polylines: Point[][]
  ) => {
    return JSON.stringify({
      markers: markers.map((marker) => {
        return {
          title: marker.title,
          point: [marker.point.latitude, marker.point.longitude],
        };
      }),
      polylines: polylines!.map((polyline) =>
        polyline.map((point) => [point.latitude, point.longitude])
      ),
    });
  };

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const parseArea = async (point: Point) => {
    const address = await reversGeocodingApi(
      {
        lat: point.latitude,
        lon: point.longitude,
        addressType: "A10",
        newAddressExtend: "Y",
      },
      accessToken
    );

    return `${address.addressInfo.city_do} ${address.addressInfo.gu_gun} ${address.addressInfo.legalDong}`;
  };

  return (
    <>
      <NaverMapProvider>
        <header>
          <BackHeaderMediumOrganism text="경로 생성하기" />
        </header>
        <CourseCreateTemplate
          initPosition={location}
          onSave={async ({ title, markers, polylines, length, image }) => {
            const [info, area, imageUrl] = await Promise.all([
              encodeInfo(markers, polylines!),
              parseArea(markers[0].point),
              uploadImage(image!),
            ]);

            createCourse({
              name: title,
              info: info,
              length: length!,
              thumbnailImage: imageUrl,
              area: area,
            });

            navigate("/profile", { replace: true });
          }}
        />
      </NaverMapProvider>
    </>
  );
};

export default CourseCreatePage;
