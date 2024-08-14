import { Navigate, useLocation, useParams } from "react-router";
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
import { useGeolocation } from "../../util/geolocation/gelocation";
import SpinnerComponent from "../../components/atoms/SpinnerComponent";
import LargeAbleButton from "../../components/atoms/Button/LargeAbleButton";
import crewinIcon from "../../assets/icons/crewinicon.svg";

const AttendancePage: React.FC = () => {
  const { sessionId } = useParams();
  const { location, error, refetch } = useGeolocation();
  const { state } = useLocation();

  const getMemberList =
    useCallback(async (): Promise<GetAttendanceMemberListResponseDto> => {
      if (!sessionId) {
        return {
          items: [],
          autoCheckStatus: "BEFORE",
          memberSessionId: 0,
          leftTime: 0,
        };
      }
      return getAttendanceMemberList({
        sessionId: parseInt(sessionId),
      });
    }, [sessionId]);

  const onStartAttendanceClick = useCallback(async () => {
    if (!sessionId || !location) return;

    await startAttendance({
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

    await postAttend({
      sessionId: parseInt(sessionId),
      lat: location?.latitude,
      lng: location?.longitude,
    });
  }, [location, sessionId]);

  if (!sessionId) return <Navigate to={`/session?type=STANDARD`} replace />;

  if (!location) {
    return (
      <div className="flex justify-center items-center h-screen p-10">
        {error ? (
          <div className="text-center items-center w-[500px]">
            <img src={crewinIcon} className="w-[125px]" />
            <div className="text-xl pt-10 font-bold text-[#A7A7A7] text-center">
              사용자 위치 권한이 필요합니다.
            </div>
            <div className="text-xl pb-10 font-bold text-[#A7A7A7] text-center">
              권한 수정 후 재시도 해주세요.
            </div>
            <LargeAbleButton onClick={refetch} text={"재시도"} />
          </div>
        ) : (
          <div>
            위치정보를 받아오는 중입니다.
            <SpinnerComponent />
          </div>
        )}
      </div>
    );
  }

  if (!state) return <Navigate to={`/session/${sessionId}`} replace />;

  return (
    <AttendanceTemplate
      getMemberList={getMemberList}
      isSessionHost={state ? state.isSessionHost : false}
      onStartAttendanceClick={onStartAttendanceClick}
      onHostAttendanceClick={onHostAttendanceClick}
      onGuestAttendanceClick={onGuestAttendanceClick}
      startAt={state.startAt}
      endAt={state.endAt}
      sessionId={parseInt(sessionId)}
      location={location}
    />
  );
};

export default AttendancePage;
