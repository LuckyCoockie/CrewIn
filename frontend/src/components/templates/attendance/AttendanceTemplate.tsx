import { useEffect, useMemo } from "react";
import {
  AttendanceMemberDto,
  ChangeAttendRequestDto,
} from "../../../apis/api/attendance";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import AttendenceMemberListOrganism from "../../organisms/AttendenceMemberListOrganism";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import TimerOrganism from "../../organisms/TimerOrganism";
import useSSE from "../../../util/sse/useSSE";

type OwnProps = {
  onStartAttendanceClick: () => Promise<void>;
  onGuestAttendanceClick: () => Promise<void>;
  onHostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  fetchMemberList: () => Promise<AttendanceMemberDto[]>;
  isSessionHost: boolean;
  startAt: string;
  isAttendStarted: boolean;
};

const AttendanceTemplate: React.FC<OwnProps> = ({
  onStartAttendanceClick,
  onGuestAttendanceClick,
  onHostAttendanceClick,
  fetchMemberList,
  isSessionHost,
  startAt,
  isAttendStarted,
}) => {
  const isSessionStarted = useMemo(() => {
    const givenTime = new Date(startAt);
    const currentTime = new Date();
    return currentTime.getTime() >= givenTime.getTime();
  }, [startAt]);

  // TODO : SSE url 추가 필요
  const { setIsActive } = useSSE("/");

  useEffect(() => {
    setIsActive(isAttendStarted);
  }, [isAttendStarted, setIsActive]);

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={"출석부"} />
      </header>
      <div className="pb-20">
        <AttendenceMemberListOrganism
          fetchData={fetchMemberList}
          isSessionHost={isSessionHost}
          onPostAttendanceClick={onHostAttendanceClick}
        />
        <div className="mx-auto w-full max-w-[550px] fixed bottom-0 left-0 right-0 flex justify-center items-center z-50 px-2 pb-20 pt-5 bg-white">
          {!isSessionStarted ? (
            isSessionHost ? (
              isAttendStarted ? (
                <TimerOrganism initSeconds={1} />
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
