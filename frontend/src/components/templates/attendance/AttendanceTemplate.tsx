import { AttendanceMemberDto } from "../../../apis/api/attendance";
import AttendenceMemberListOrganism from "../../organisms/AttendenceMemberListOrganism";

type OwnProps = {
  fetchMemberList: () => Promise<AttendanceMemberDto[]>;
};

const AttendanceTemplate: React.FC<OwnProps> = ({ fetchMemberList }) => {
  return <AttendenceMemberListOrganism fetchData={fetchMemberList} />;
};

export default AttendanceTemplate;
