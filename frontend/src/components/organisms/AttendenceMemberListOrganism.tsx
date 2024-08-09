import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import qs from "query-string";
import {
  AttendanceMemberDto,
  ChangeAttendRequestDto,
} from "../../apis/api/attendance";
import MemberListItem from "../molecules/List/MemberListMolecule";
import AttendenceButton from "../molecules/AttendenceButton";
import { useCallback, useState } from "react";
import useSSE from "../../util/sse/useSSE";

// 출석 시작 전, 출석 중, 출석 종료 후

type OwnProps<T> = {
  fetchData: (props: T) => Promise<AttendanceMemberDto[]>;
  onPostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  isSessionHost: boolean;
  sessionId: number;
};

const AttendenceMemberListOrganism = <T,>({
  fetchData,
  onPostAttendanceClick: onAttendanceChange,
  isSessionHost,
  sessionId,
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
      // TODO : 처음에 누가 출석되어있는지 받아올 방법 필요
      memberList.forEach(({ memberSessionId }) =>
        attendanceStateMap.set(memberSessionId, false)
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

  // TODO : SSE url 추가 필요
  useSSE(`/attendance/connect/${sessionId}`, handleAttendanceChange);

  if (isError || !memberList) return "데이터를 불러오지 못했습니다.";

  return (
    <>
      {memberList.map((member, index) => (
        <MemberListItem key={index} {...member}>
          {isSessionHost ? (
            <AttendenceButton
              initPresent={
                attendanceStateMap.get(member.memberSessionId) ?? false
              }
              isAuto={false}
              onClick={(state) => {
                onAttendanceChange({
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

export default AttendenceMemberListOrganism;
