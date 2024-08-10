import { useLocation, useParams } from "react-router";
import AttendanceTemplate from "../../components/templates/attendance/AttendanceTemplate";
import { useCallback } from "react";
import {
  ChangeAttendRequestDto,
  GetAttendanceMemberListResponseDto,
  changeAttend,
  getAttendanceMemberList,
  postAttend,
  startAttendance,
} from "../../apis/api/attendance";
import useGeolocation from "../../util/geolocation/gelocation";

const AttendancePage: React.FC = () => {
  const { sessionId } = useParams();
  const { location } = useGeolocation();
  const { state } = useLocation();

  const getMemberList =
    useCallback(async (): Promise<GetAttendanceMemberListResponseDto> => {
      if (!sessionId) {
        return {
          items: [],
          autoCheckStatus: "BEFORE",
          leftTime: 0,
        };
      }
      return getAttendanceMemberList({
        sessionId: parseInt(sessionId),
      });
    }, [sessionId]);

  const onStartAttendanceClick = useCallback(async () => {
    if (!sessionId || !location) return;

    startAttendance({
      sessionId: parseInt(sessionId),
      lat: location.latitude,
      lng: location.longitude,
    });
  }, [location, sessionId]);

  const onHostAttendanceClick = useCallback(
    async (dto: ChangeAttendRequestDto) => {
      changeAttend(dto);
    },
    []
  );

  const onGuestAttendanceClick = useCallback(async () => {
    if (!sessionId || !location) return;

    postAttend({
      sessionId: parseInt(sessionId),
      lat: location?.latitude,
      lng: location?.longitude,
    });
  }, [location, sessionId]);

  if (!sessionId) return "sessionId가 필요합니다.";

  return (
    <AttendanceTemplate
      getMemberList={getMemberList}
      onStartAttendanceClick={onStartAttendanceClick}
      isSessionHost={state ? state.isSessionHost : false}
      onHostAttendanceClick={onHostAttendanceClick}
      onGuestAttendanceClick={onGuestAttendanceClick}
      startAt={state.startAt}
      endAt={state.endAt}
      sessionId={parseInt(sessionId)}
    />
  );
};

export default AttendancePage;
