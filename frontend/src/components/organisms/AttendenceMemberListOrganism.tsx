import { useQuery } from "react-query";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../apis/utils/errorCode/ErrorResponseDto";
import qs from "query-string";
import { AttendanceMemberDto } from "../../apis/api/attendance";
import MemberListItem from "../molecules/List/MemberListMolecule";

type OwnProps<T> = {
  fetchData: (props: T) => Promise<AttendanceMemberDto[]>;
};

const AttendenceMemberListOrganism = <T,>({ fetchData }: OwnProps<T>) => {
  const query = qs.parse(location.search) as T;

  const { data, isError } = useQuery<
    AttendanceMemberDto[],
    AxiosError<ErrorResponseDto>
  >([`session`, query], () => fetchData(query), {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isError || !data) return "데이터를 불러오지 못했습니다.";

  return (
    <div className="w-full">
      {data.map((item, index) => (
        <MemberListItem key={index} {...item}>
          <div className="flex gap-2">
            <button className="border border-gray-400 w-20 h-10 rounded-md text-sm">
              초대하기
            </button>
          </div>
        </MemberListItem>
      ))}
    </div>
  );
};

export default AttendenceMemberListOrganism;
