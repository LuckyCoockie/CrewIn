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

// 출석 시작 전, 출석 중, 출석 종료 후

type OwnProps<T> = {
  fetchData: (props: T) => Promise<AttendanceMemberDto[]>;
  onPostAttendanceClick: (dto: ChangeAttendRequestDto) => Promise<void>;
  isSessionHost: boolean;
};

const AttendenceMemberListOrganism = <T,>({
  fetchData,
  onPostAttendanceClick: onAttendanceChange,
  isSessionHost,
}: OwnProps<T>) => {
  const query = qs.parse(location.search) as T;

  const { data: memberList, isError } = useQuery<
    AttendanceMemberDto[],
    AxiosError<ErrorResponseDto>
  >([`session`, query], () => fetchData(query), {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isError || !memberList) return "데이터를 불러오지 못했습니다.";

  return (
    <>
      {memberList.map((member, index) => (
        <MemberListItem key={index} {...member}>
          {isSessionHost ? (
            <AttendenceButton
              initPresent={false}
              isAuto={true}
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
