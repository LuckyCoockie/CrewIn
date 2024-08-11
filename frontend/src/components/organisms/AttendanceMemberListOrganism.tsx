import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import qs from "query-string";
import {
  AttendanceMemberDto,
  AutoCheckStatus,
  ChangeAttendRequestDto,
} from "../../apis/api/attendance";
import MemberListItem from "../molecules/List/MemberListMolecule";
import AttendanceButton from "../molecules/AttendanceButton";
import { useCallback, useEffect, useState } from "react";
import useSSE from "../../util/sse/useSSE";

type OwnProps<T> = {
  fetchData: (props: T) => Promise<AttendanceMemberDto[]>;
  onPostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  isSessionHost: boolean;
  sessionId: number;
  autoCheckStatus: AutoCheckStatus;
  isSessionEnded: boolean;
  onAttendanceChange: (data: {
    memberSessionId: number;
    isAttend: boolean;
  }) => void;
};

const AttendanceMemberListOrganism = <T,>({
  fetchData,
  onPostAttendanceClick,
  isSessionHost,
  sessionId,
  autoCheckStatus,
  isSessionEnded,
  onAttendanceChange,
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
      onAttendanceChange(data);
      attendanceStateMap.set(data.memberSessionId, data.isAttend);
      setAttendanceStateMap(new Map(attendanceStateMap));
    },
    [attendanceStateMap, onAttendanceChange]
  );

  const handlePostAttendanceClick = useCallback(
    async (memberSessionId: number, state: boolean) => {
      if (!isSessionHost || isSessionEnded) return;
      await onPostAttendanceClick({
        attend: state,
        memberSessionId: memberSessionId,
      });
    },
    [isSessionEnded, isSessionHost, onPostAttendanceClick]
  );

  const { setIsActive } = useSSE({
    url: `/attendance/connect/${sessionId}`,
    events: [{ event: "attendance", onEvent: handleAttendanceChange }],
  });

  useEffect(() => {
    setIsActive(autoCheckStatus !== "BEFORE" && !isSessionEnded);
  }, [autoCheckStatus, isSessionEnded, setIsActive]);

  if (isError || !memberList) return "데이터를 불러오지 못했습니다.";

  return (
    <>
      {memberList.map((member, index) => (
        <MemberListItem key={index} {...member}>
          <AttendanceButton
            initPresent={
              attendanceStateMap.get(member.memberSessionId) ?? false
            }
            isAutoAttendanceEnded={autoCheckStatus === "AFTER"}
            onClick={(state) =>
              handlePostAttendanceClick(member.memberSessionId, state)
            }
          />
        </MemberListItem>
      ))}
    </>
  );
};

export default AttendanceMemberListOrganism;
