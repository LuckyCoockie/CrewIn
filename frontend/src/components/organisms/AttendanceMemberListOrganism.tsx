import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import qs from "query-string";
import {
  AttendanceMemberDto,
  ChangeAttendRequestDto,
} from "../../apis/api/attendance";
import MemberListItem from "../molecules/List/MemberListMolecule";
import AttendanceButton from "../molecules/AttendanceButton";
import { useCallback, useEffect, useState } from "react";
import useSSE from "../../util/sse/useSSE";

// 출석 시작 전, 출석 중, 출석 종료 후

type OwnProps<T> = {
  fetchData: (props: T) => Promise<AttendanceMemberDto[]>;
  onPostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  isSessionHost: boolean;
  sessionId: number;
  isAutoCheckInProgress: boolean;
};

const AttendanceMemberListOrganism = <T,>({
  fetchData,
  onPostAttendanceClick,
  isSessionHost,
  sessionId,
  isAutoCheckInProgress,
}: OwnProps<T>) => {
  const query = qs.parse(location.search) as T;
  const [attendanceStateMap, setAttendanceStateMap] = useState(
    new Map<number, boolean>()
  );

  const { data: memberList, isError } = useQuery<
    AttendanceMemberDto[],
    AxiosError<ErrorResponseDto>
  >([`session`, query], () => fetchData(query), {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    onSuccess: (memberList) => {
      memberList.forEach(({ memberSessionId, isAttend }) =>
        attendanceStateMap.set(memberSessionId, isAttend)
      );
    },
  });

  const handleAttendanceChange = useCallback(
    (data: { memberSessionId: number; isAttend: boolean }) => {
      attendanceStateMap.set(data.memberSessionId, data.isAttend);
      setAttendanceStateMap(new Map(attendanceStateMap));
    },
    [attendanceStateMap]
  );

  const { setIsActive } = useSSE({
    url: `/attendance/connect/${sessionId}`,
    onMessage: handleAttendanceChange,
  });

  useEffect(() => {
    setIsActive(isAutoCheckInProgress);
  }, [isAutoCheckInProgress, setIsActive]);

  if (isError || !memberList) return "데이터를 불러오지 못했습니다.";

  return (
    <>
      {memberList.map((member, index) => (
        <MemberListItem key={index} {...member}>
          {isSessionHost ? (
            <AttendanceButton
              initPresent={
                attendanceStateMap.get(member.memberSessionId) ?? false
              }
              isAttendanceStarted={isAutoCheckInProgress}
              onClick={(state) => {
                onPostAttendanceClick({
                  attend: state,
                  memberSessionId: member.memberSessionId,
                });
              }}
            />
          ) : (
            <></>
          )}
        </MemberListItem>
      ))}
    </>
  );
};

export default AttendanceMemberListOrganism;
