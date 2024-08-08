import { useLocation, useParams } from "react-router";
import AttendanceTemplate from "../../components/templates/attendance/AttendanceTemplate";
import { useCallback } from "react";
import {
  ChangeAttendRequestDto,
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

  // TODO : 출석이 시작되었는지는 확인 필요
  const isAttendStarted = false;

  const getMemberList = useCallback(async () => {
    if (!sessionId) return [];
    return getAttendanceMemberList({ sessionId: parseInt(sessionId) });
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

  return (
    <AttendanceTemplate
      fetchMemberList={getMemberList}
      onStartAttendanceClick={onStartAttendanceClick}
      isSessionHost={state ? state.isSessionHost : false}
      onHostAttendanceClick={onHostAttendanceClick}
      onGuestAttendanceClick={onGuestAttendanceClick}
      startAt={state.startAt}
      isAttendStarted={isAttendStarted}
    />
  );
};

export default AttendancePage;
