import { Navigate, useLocation, useParams } from "react-router";
import AttendanceTemplate from "../../components/templates/attendance/AttendanceTemplate";
import { useCallback, useEffect, useState } from "react";
import {
  ChangeAttendRequestDto,
  GetAttendanceMemberListResponseDto,
  changeAttend,
  getAttendanceMemberList,
  postAttend,
  startAttendance,
} from "../../apis/api/attendance";
import { useGeolocation } from "../../util/geolocation/gelocation";
import { reversGeocodingApi } from "../../apis/api/tmap/geocodeApi";
import Modal from "../../components/molecules/ModalMolecules";

const AttendancePage: React.FC = () => {
  const { sessionId } = useParams();
  const { location } = useGeolocation();
  const [spot, setSpot] = useState<string>();
  const { state } = useLocation();
  const [isLocationErrorModalOpen, setIsLocationErrorModalOpenModalOpen] = useState(false);
  const [isAttendanceErrorModalOpen, setIsAttendanceErrorModalOpen] =
    useState(false);

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
    if (!sessionId || !location) {
      setIsLocationErrorModalOpenModalOpen(true);
      return;
    }

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
    if (!sessionId || !location) {
      setIsLocationErrorModalOpenModalOpen(true);
      return;
    }

    await postAttend({
      sessionId: parseInt(sessionId),
      lat: location?.latitude,
      lng: location?.longitude,
    }).catch(() => {
      setIsAttendanceErrorModalOpen(true);
    });
  }, [location, sessionId]);

  useEffect(() => {
    if (!location) return;
    reversGeocodingApi({
      lat: location.latitude,
      lon: location.longitude,
      addressType: "A10",
      newAddressExtend: "Y",
    }).then((address) => {
      setSpot(
        `${address.addressInfo.city_do} ${address.addressInfo.gu_gun} ${address.addressInfo.legalDong}`
      );
    });
  }, [location]);

  if (!sessionId) return <Navigate to={`/session?type=STANDARD`} replace />;

  if (!state) return <Navigate to={`/session/${sessionId}`} replace />;

  return (
    <>
      <AttendanceTemplate
        getMemberList={getMemberList}
        isSessionHost={state ? state.isSessionHost : false}
        onStartAttendanceClick={onStartAttendanceClick}
        onHostAttendanceClick={onHostAttendanceClick}
        onGuestAttendanceClick={onGuestAttendanceClick}
        startAt={state.startAt}
        endAt={state.endAt}
        sessionId={parseInt(sessionId)}
        location={spot}
      />
      {isLocationErrorModalOpen && (
        <Modal title="출석 실패" onClose={() => setIsLocationErrorModalOpenModalOpen(false)}>
          <p>사용자 위치 권한이 필요합니다. 권한 수정 후 재시도 해주세요.</p>
        </Modal>
      )}
      {isAttendanceErrorModalOpen && (
        <Modal title="출석 실패" onClose={() => setIsAttendanceErrorModalOpen(false)}>
          <p>
            출석에 실패하였습니다. 주최자의 거리가 100m 미만이여야 출석이
            가능합니다.
          </p>
        </Modal>
      )}
    </>
  );
};

export default AttendancePage;
