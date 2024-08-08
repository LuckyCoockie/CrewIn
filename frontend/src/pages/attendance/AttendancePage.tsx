import { useLocation, useParams } from "react-router";
import AttendanceTemplate from "../../components/templates/attendance/AttendanceTemplate";
import { useCallback } from "react";
import {
  ChangeAttendRequestDto,
  changeAttend,
  getAttendanceMemberList,
  startAttendance,
} from "../../apis/api/attendance";
import useGeolocation from "../../util/geolocation/gelocation";

const AttendancePage: React.FC = () => {
  const { sessionId } = useParams();
  const { location } = useGeolocation();
  const { state } = useLocation();

  console.log(state);

  const getMemberList = useCallback(async () => {
    if (!sessionId) return [];
    return getAttendanceMemberList({ sessionId: parseInt(sessionId) });
  }, [sessionId]);

  const onStartAttendance = useCallback(async () => {
    if (!sessionId || !location) return;

    startAttendance({
      sessionId: parseInt(sessionId),
      lat: location?.latitude,
      lng: location?.longitude,
    });
  }, [location, sessionId]);

  const onAttendanceChange = useCallback(async (dto: ChangeAttendRequestDto) => {
    changeAttend(dto);
  }, []);

  return (
    <AttendanceTemplate
      fetchMemberList={getMemberList}
      onStartAttendance={onStartAttendance}
      isSessionHost={state ? state.isSessionHost : false}
      onAttendanceChange={onAttendanceChange}
    />
  );
};

export default AttendancePage;
