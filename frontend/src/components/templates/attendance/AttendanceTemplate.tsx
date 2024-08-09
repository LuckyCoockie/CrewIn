import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
    const givenTime = new Date(startAt);
    const currentTime = new Date();
    return currentTime.getTime() >= givenTime.getTime();
  }, [startAt]);

  const { setIsActive } = useSSE(`/attendance/connect/${sessionId}`);

  const [isAutoCheckInProgress, setIsAutoCheckInProgress] =
    useState<boolean>(false);

  const [leftTime, setLeftTime] = useState<number>(0);

  const fetchMemberList = useCallback(async () => {
    const response = await getMemberList();
    setIsAutoCheckInProgress(response.autoCheckInProgress);
    setLeftTime(response.leftTime);
    return response.items;
  }, [getMemberList]);

  useEffect(() => {
    setIsActive(isAutoCheckInProgress);
  }, [isAutoCheckInProgress, setIsActive]);

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
          isAutoCheckInProgress={isAutoCheckInProgress}
        />
        <div className="mx-auto w-full max-w-[550px] fixed bottom-0 left-0 right-0 flex justify-center items-center z-50 px-2 pb-20 pt-5 bg-white">
          {isSessionStarted ? (
            isSessionHost ? (
              isAutoCheckInProgress ? (
                <TimerOrganism initSeconds={leftTime} />
              ) : (
                <LargeAbleButton
                  text="자동 출석 시작"
                  onClick={onStartAttendanceClick}
                />
              )
            ) : (
              <LargeAbleButton
                text="출석하기"
                onClick={onGuestAttendanceClick}
              />
            )
          ) : (
            <div className="font-bold">
              {"출석은 세션 시작 시각 이후 시작할 수 있습니다."}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceTemplate;
