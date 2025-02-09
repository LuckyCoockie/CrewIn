import { useEffect, useState } from "react";
import {
  CreateCourseRequestDto,
  getCourseDetail,
  updateCourse,
} from "../../apis/api/course.ts";
import { uploadImage } from "../../apis/api/presigned.ts";
import CourseCreateTemplate from "../../components/templates/CourseCreateTemplate.tsx";
import { NaverMapProvider } from "../../util/maps/naver_map/context.tsx";
import { Point } from "../../apis/api/tmap/directionApi.ts";
import { reversGeocodingApi } from "../../apis/api/tmap/geocodeApi.ts";
import { Navigate, useNavigate, useParams } from "react-router";
import BackHeaderMediumOrganism from "../../components/organisms/BackHeaderMediumOrganism.tsx";
import EditDeleteDropdownOrganism from "../../components/organisms/EditDeleteDropdownOrganism.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../modules/index.ts";
import UnauthorizedPage from "../util/UnauthorizedPage.tsx";

const CourseEditPage: React.FC = () => {
  const { courseId } = useParams();
  const [initValue, setInitValue] = useState<CreateCourseRequestDto>();

  const navigate = useNavigate();
  const [creatorId, setCreatorId] = useState<number>();
  const memberId = useSelector((state: RootState) => state.auth.memberId);

  useEffect(() => {
    if (!courseId || !parseInt(courseId)) return;
    getCourseDetail({ id: parseInt(courseId) }).then((data) => {
      setCreatorId(data.creatorId);
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
      polylines: number[][][];
    } = JSON.parse(info);
    return {
      markers: data.markers.map((marker) => {
        return {
          title: marker.title,
          point: { latitude: marker.point[0], longitude: marker.point[1] },
        };
      }),
      polylines: data.polylines.map((polyline) =>
        polyline.map((point) => {
          return { latitude: point[0], longitude: point[1] };
        })
      ),
    };
  };

  const parseInitValue = (value: CreateCourseRequestDto | undefined) => {
    if (!value) return;
    const info = decodeInfo(value.info);
    return {
      title: value.name,
      markers: info?.markers ?? [],
      length: value.length,
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

  if (creatorId && creatorId !== memberId) return <UnauthorizedPage />;

  return (
    <NaverMapProvider>
      <header className="justify-between items-center">
        <BackHeaderMediumOrganism text="경로 수정하기" />
        <EditDeleteDropdownOrganism type="COURSE" idData={parseInt(courseId)} />
      </header>
      <CourseCreateTemplate
        initValue={parseInitValue(initValue)}
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
          }).then(() => navigate("/profile", { replace: true }));
        }}
      />
    </NaverMapProvider>
  );
};

export default CourseEditPage;
