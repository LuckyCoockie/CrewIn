import { useCallback, useMemo, useState } from "react";
import {
  AutoCheckStatus,
  ChangeAttendRequestDto,
  GetAttendanceMemberListResponseDto,
} from "../../../apis/api/attendance";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import AttendanceMemberListOrganism from "../../organisms/AttendanceMemberListOrganism";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import TimerOrganism from "../../organisms/TimerOrganism";
import ModalConfirm from "../../molecules/ModalConfirmMolecules";
import { reversGeocodingApi } from "../../../util/maps/tmap/apis/api/geocodeApi";
import { Point } from "../../../util/maps/tmap/apis/api/directionApi";
import locationImage from "../../../assets/icons/location.png";
import { IconTextComponent } from "../../atoms/text/IconText";

type OwnProps = {
  onStartAttendanceClick: () => Promise<void>;
  onGuestAttendanceClick: () => Promise<void>;
  onHostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  getMemberList: () => Promise<GetAttendanceMemberListResponseDto>;
  isSessionHost: boolean;
  startAt: string;
  endAt: string;
  sessionId: number;
  location: Point;
};

const AttendanceTemplate: React.FC<OwnProps> = ({
  onStartAttendanceClick,
  onGuestAttendanceClick,
  onHostAttendanceClick,
  getMemberList,
  isSessionHost,
  startAt,
  endAt,
  sessionId,
  location,
}) => {
  const isSessionStarted = useMemo(() => {
    const startTime = new Date(startAt).getTime();
    const currentTime = new Date().getTime();
    return currentTime >= startTime;
  }, [startAt]);

  const isSessionEnded = useMemo(() => {
    const endTime = new Date(endAt).getTime();
    const currentTime = new Date().getTime();
    return currentTime >= endTime;
  }, [endAt]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [memberSessionId, setMemberSessionId] = useState<number>();
  const [isAttend, setIsAttend] = useState<boolean>(false);

  const [spot, setSpot] = useState<string>();

  const [autoCheckStatus, setAutoCheckStatus] =
    useState<AutoCheckStatus>("BEFORE");

  const isBeforeAutoCheck = useMemo(
    () => autoCheckStatus === "BEFORE",
    [autoCheckStatus]
  );

  const isDuringAutoCheck = useMemo(
    () => autoCheckStatus === "DURING",
    [autoCheckStatus]
  );

  const isAfterAutoCheck = useMemo(
    () => autoCheckStatus === "AFTER",
    [autoCheckStatus]
  );

  const [leftTime, setLeftTime] = useState<number>(0);

  const fetchMemberList = useCallback(async () => {
    const response = await getMemberList();
    setAutoCheckStatus(response.autoCheckStatus);
    setLeftTime(response.leftTime);
    setMemberSessionId(response.memberSessionId);
    response.items.forEach((data) => {
      if (data.memberSessionId === response.memberSessionId) {
        setIsAttend(data.isAttend);
      }
    });
    return response.items;
  }, [getMemberList]);

  const handleStartAttendanceClick = useCallback(async () => {
    const address = await reversGeocodingApi({
      lat: location.latitude,
      lon: location.longitude,
      addressType: "A10",
      newAddressExtend: "Y",
    });
    setSpot(
      `${address.addressInfo.city_do} ${address.addressInfo.gu_gun} ${address.addressInfo.legalDong}`
    );
    setIsModalOpen(true);
  }, [location.latitude, location.longitude]);

  const handleAttendanceChange = useCallback(
    (data: { memberSessionId: number; isAttend: boolean }) => {
      if (data.memberSessionId === memberSessionId) setIsAttend(data.isAttend);
    },
    [memberSessionId]
  );

  const handleGuestAttendanceClick = useCallback(async () => {
    const address = await reversGeocodingApi({
      lat: location.latitude,
      lon: location.longitude,
      addressType: "A10",
      newAddressExtend: "Y",
    });
    setSpot(
      `${address.addressInfo.city_do} ${address.addressInfo.gu_gun} ${address.addressInfo.legalDong}`
    );
    setIsModalOpen(true);
  }, [location.latitude, location.longitude]);

  const handleClickModalConfirm = useCallback(() => {
    if (isSessionHost) {
      onStartAttendanceClick().then(() => {
        fetchMemberList();
        setIsModalOpen(false);
      });
    } else {
      onGuestAttendanceClick()
        .then(() => {
          fetchMemberList();
          setIsModalOpen(false);
        })
        .catch(() => {
          alert(
            "출석에 실패하였습니다. 주최자의 거리가 100m 미만이여야 출석이 가능합니다."
          );
        });
    }
  }, [
    fetchMemberList,
    isSessionHost,
    onGuestAttendanceClick,
    onStartAttendanceClick,
  ]);

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={"출석부"} />
      </header>
      <div className="pb-20">
        <AttendanceMemberListOrganism
          fetchData={fetchMemberList}
          isSessionHost={isSessionHost}
          onPostAttendanceClick={onHostAttendanceClick}
          sessionId={sessionId}
          autoCheckStatus={autoCheckStatus}
          isSessionEnded={isSessionEnded}
          onAttendanceChange={handleAttendanceChange}
        />
        <div className="mx-auto w-full max-w-[550px] fixed bottom-0 left-0 right-0 text-center z-50 px-2 pb-20 pt-5 bg-white font-bold">
          {!isSessionStarted ? (
            "출석 시작은 세션 시작 후 할 수 있습니다."
          ) : isSessionEnded ? (
            "세션이 종료되어 출석을 수정할 수 없습니다."
          ) : (
            <>
              {isBeforeAutoCheck && isSessionHost && (
                <LargeAbleButton
                  text="자동 출석 시작"
                  onClick={handleStartAttendanceClick}
                />
              )}
              {isDuringAutoCheck &&
                (isSessionHost ? (
                  <div className="w-full text-center">
                    {"자동 출석 종료 후 출석을 수정할 수 있습니다."}
                    <TimerOrganism
                      initSeconds={leftTime}
                      onEnd={() => setAutoCheckStatus("AFTER")}
                    />
                  </div>
                ) : isAttend ? (
                  <>{"출석 완료"}</>
                ) : (
                  <LargeAbleButton
                    text="출석하기"
                    onClick={handleGuestAttendanceClick}
                  />
                ))}
              {isAfterAutoCheck &&
                "자동 출석이 종료되어 수동 출석만 가능합니다."}
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ModalConfirm
          title={
            isSessionHost ? "출석을 시작하시겠습니까?" : "출석 하시겠습니까?"
          }
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleClickModalConfirm}
          type="default"
        >
          <p>{`현재 위치를 확인해주세요.`}</p>
          <IconTextComponent
            icon={locationImage}
            text={spot ?? "새로고침 해주세요."}
          />
        </ModalConfirm>
      )}
    </>
  );
};

export default AttendanceTemplate;
