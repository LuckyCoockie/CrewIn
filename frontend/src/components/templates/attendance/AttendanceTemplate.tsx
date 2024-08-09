import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AutoCheckStatus,
  ChangeAttendRequestDto,
  GetAttendanceMemberListResponseDto,
} from "../../../apis/api/attendance";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import AttendanceMemberListOrganism from "../../organisms/AttendanceMemberListOrganism";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import TimerOrganism from "../../organisms/TimerOrganism";
import useSSE from "../../../util/sse/useSSE";

type OwnProps = {
  onStartAttendanceClick: () => Promise<void>;
  onGuestAttendanceClick: () => Promise<void>;
  onHostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  getMemberList: () => Promise<GetAttendanceMemberListResponseDto>;
  isSessionHost: boolean;
  startAt: string;
  sessionId: number;
};

const AttendanceTemplate: React.FC<OwnProps> = ({
  onStartAttendanceClick,
  onGuestAttendanceClick,
  onHostAttendanceClick,
  getMemberList,
  isSessionHost,
  startAt,
  sessionId,
}) => {
  const isSessionStarted = useMemo(() => {
    const startTime = new Date(startAt).getTime();
    const currentTime = new Date().getTime();
    return currentTime >= startTime;
  }, [startAt]);

  const { setIsActive } = useSSE({
    url: `/attendance/connect/${sessionId}`,
  });

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
    return response.items;
  }, [getMemberList]);

  useEffect(() => {
    setIsActive(isDuringAutoCheck);
  }, [isDuringAutoCheck, setIsActive]);

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
          isAutoCheckInProgress={isDuringAutoCheck}
        />
        <div className="mx-auto w-full max-w-[550px] fixed bottom-0 left-0 right-0 flex justify-center items-center z-50 px-2 pb-20 pt-5 bg-white font-bold">
          {!isSessionStarted && "출석 시작은 세션 시작 후 할 수 있습니다."}
          {isBeforeAutoCheck &&
            (isSessionHost ? (
              <LargeAbleButton
                text="자동 출석 시작"
                onClick={onStartAttendanceClick}
              />
            ) : (
              <LargeAbleButton
                text="출석하기"
                onClick={onGuestAttendanceClick}
              />
            ))}
          {isDuringAutoCheck && <TimerOrganism initSeconds={leftTime} />}
          {isAfterAutoCheck && "자동 출석이 종료되어 수동 출석만 가능합니다."}
        </div>
      </div>
    </>
  );
};

export default AttendanceTemplate;
