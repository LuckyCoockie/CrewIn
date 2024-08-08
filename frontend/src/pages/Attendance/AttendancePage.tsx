import { useParams } from "react-router";
import AttendanceTemplate from "../../components/templates/attendance/AttendanceTemplate";
import { useCallback } from "react";
import { getAttendanceMemberList } from "../../apis/api/attendance";

const AttendancePage: React.FC = () => {
  const { sessionId } = useParams();

  const getMemberList = useCallback(async () => {
    if (!sessionId) return [];
    return getAttendanceMemberList({ sessionId: parseInt(sessionId) });
  }, [sessionId]);

  return <AttendanceTemplate fetchMemberList={getMemberList} />;
};

export default AttendancePage;
