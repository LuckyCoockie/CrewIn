import { useCallback, useMemo, useState } from "react";
import {
  AutoCheckStatus,
  ChangeAttendRequestDto,
  GetAttendanceMemberListResponseDto,
} from "../../../apis/api/attendance";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import AttendanceMemberListOrganism from "../../organisms/attendance/AttendanceMemberListOrganism";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import TimerOrganism from "../../organisms/TimerOrganism";
import ModalConfirm from "../../molecules/ModalConfirmMolecules";
import { reversGeocodingApi } from "../../../util/maps/tmap/apis/api/geocodeApi";
import { Point } from "../../../util/maps/tmap/apis/api/directionApi";
import locationImage from "../../../assets/icons/location.png";
import { IconTextComponent } from "../../atoms/text/IconText";
import { ReactComponent as InfoIcon } from "../../../assets/icons/info_icon.svg";
import Modal from "../../molecules/ModalMolecules";

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

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
    setIsAttendanceModalOpen(true);
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
    setIsAttendanceModalOpen(true);
  }, [location.latitude, location.longitude]);

  const handleClickAttendanceModalConfirm = useCallback(() => {
    if (isSessionHost) {
      onStartAttendanceClick().then(() => {
        setTimeout(() => {
          fetchMemberList();
          setIsAttendanceModalOpen(false);
        }, 100);
      });
    } else {
      onGuestAttendanceClick()
        .then(() => {
          setTimeout(() => {
            fetchMemberList();
            setIsAttendanceModalOpen(false);
          }, 100);
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

  const handleClickInfoModalConfirm = useCallback(() => {
    setIsInfoModalOpen(true);
  }, []);

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={"출석부"} />
        <InfoIcon className="ml-2" onClick={handleClickInfoModalConfirm} />
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
      {isAttendanceModalOpen && (
        <ModalConfirm
          title={
            isSessionHost ? "출석을 시작하시겠습니까?" : "출석 하시겠습니까?"
          }
          onClose={() => setIsAttendanceModalOpen(false)}
          onConfirm={handleClickAttendanceModalConfirm}
          type="default"
        >
          <p>{`현재 위치를 확인해주세요.`}</p>
          <IconTextComponent
            icon={locationImage}
            text={spot ?? "새로고침 해주세요."}
          />
        </ModalConfirm>
      )}
      {isInfoModalOpen && (
        <Modal
          title={"출석부"}
          onClose={() => setIsInfoModalOpen(false)}
          titleSize="text-xl"
        >
          <div className="pb-4">
            <label className="block min-h-[2rem] tracking-tighter text-gray-900 min-h-[2rem] text-lg">
              {"자동 출석"}
            </label>
            <p>{"· 세션 시작 시각 이후 시작할 수 있습니다."}</p>
            <p>{"· 개최자 기준 100m 내에서 가능합니다."}</p>
            <p>{"· 중간에 출석 정보를 수정할 수 없습니다."}</p>
          </div>
          <div>
            <label className="block min-h-[2rem] tracking-tighter text-gray-900 min-h-[2rem] text-lg">
              {"수동 출석"}
            </label>
            <p>{"· 자동 출석 종료 후 출석 정보를 수정할 수 있습니다."}</p>
            <p>{"· 세션 종료 시각 이후에는 수정할 수 없습니다."}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AttendanceTemplate;
