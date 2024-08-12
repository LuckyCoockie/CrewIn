import { useEffect, useState } from "react";
import {
  CreateCourseRequestDto,
  getCourseDetail,
  updateCourse,
} from "../../apis/api/course.ts";
import { uploadImage } from "../../apis/api/presigned.ts";
import CourseCreateTemplate from "../../components/templates/CourseCreateTemplate.tsx";
import { NaverMapProvider } from "../../util/maps/naver_map/context.tsx";
import { Point } from "../../util/maps/tmap/apis/api/directionApi.ts";
import { reversGeocodingApi } from "../../util/maps/tmap/apis/api/geocodeApi.ts";
import { Navigate, useParams } from "react-router";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism.tsx";

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const [initValue, setInitValue] = useState<CreateCourseRequestDto>();

  useEffect(() => {
    if (!courseId || !parseInt(courseId)) return;
    getCourseDetail({ id: parseInt(courseId) }).then((data) => {
      setInitValue(data);
    });
  }, [courseId]);

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

  const decodeInfo = (info: string | undefined) => {
    if (!info) return;
    const data: {
      markers: { title: string; point: number[] }[];
      polylines: Point[][];
    } = JSON.parse(info);
    return {
      markers: data.markers.map((marker) => {
        return {
          title: marker.title,
          point: { latitude: marker.point[0], longitude: marker.point[1] },
        };
      }),
    };
  };

  const parseInitValue = (value: CreateCourseRequestDto | undefined) => {
    if (!value) return;
    const info = decodeInfo(value.info);
    return {
      title: value.name,
      markers: info?.markers ?? [],
    };
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

  if (!courseId || !parseInt(courseId)) {
    return <Navigate to={"/profile"} replace />;
  }

  return (
    <>
      <NaverMapProvider>
        <header>
          <BackHeaderMediumOrganism text="경로 상세보기" />
        </header>
        <CourseCreateTemplate
          initValue={parseInitValue(initValue)}
          editable={false}
          onSave={async ({ title, markers, polylines, length, image }) => {
            const [info, area, imageUrl] = await Promise.all([
              encodeInfo(markers, polylines!),
              parseArea(markers[0].point),
              uploadImage(image!),
            ]);

            updateCourse({
              id: parseInt(courseId),
              value: {
                name: title,
                info: info,
                length: length!,
                thumbnailImage: imageUrl,
                area: area,
              },
            });
          }}
        />
      </NaverMapProvider>
    </>
  );
};

export default CourseDetailPage;
