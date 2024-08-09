import { useLocation, useParams } from "react-router";
import AttendanceTemplate from "../../components/templates/attendance/AttendanceTemplate";
import { useCallback, useState } from "react";
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
  const [isAttendStarted, setIsAttendStarted] = useState<boolean>(false);

  const getMemberList = useCallback(async () => {
    if (!sessionId) return [];
    const response = await getAttendanceMemberList({
      sessionId: parseInt(sessionId),
    });
    setIsAttendStarted(response.autoCheckInProgress);
    return response.items;
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
      fetchMemberList={getMemberList}
      onStartAttendanceClick={onStartAttendanceClick}
      isSessionHost={state ? state.isSessionHost : false}
      onHostAttendanceClick={onHostAttendanceClick}
      onGuestAttendanceClick={onGuestAttendanceClick}
      startAt={state.startAt}
      isAttendStarted={isAttendStarted}
      sessionId={parseInt(sessionId)}
    />
  );
};

export default AttendancePage;
