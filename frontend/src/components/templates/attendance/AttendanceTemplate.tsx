import {
  AttendanceMemberDto,
  ChangeAttendRequestDto,
} from "../../../apis/api/attendance";
import LargeAbleButton from "../../atoms/Button/LargeAbleButton";
import AttendenceMemberListOrganism from "../../organisms/AttendenceMemberListOrganism";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";

type OwnProps = {
  onStartAttendance: () => Promise<void>;
  onAttendanceChange: (dto: ChangeAttendRequestDto) => Promise<void>;
  fetchMemberList: () => Promise<AttendanceMemberDto[]>;
  isSessionHost: boolean;
};

const AttendanceTemplate: React.FC<OwnProps> = ({
  onStartAttendance,
  onAttendanceChange,
  fetchMemberList,
  isSessionHost,
}) => {
  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={"출석부"} />
      </header>
      <div className="pb-20">
        <AttendenceMemberListOrganism
          fetchData={fetchMemberList}
          isSessionHost={isSessionHost}
          onAttendanceChange={onAttendanceChange}
        />
        {isSessionHost && (
          <div className="mx-auto w-full max-w-[550px] fixed bottom-20 left-0 right-0 flex justify-center items-center z-50">
            <LargeAbleButton
              text="자동 출석 시작"
              onClick={onStartAttendance}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceTemplate;
