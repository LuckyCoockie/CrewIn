import React from "react";
import { ReactComponent as AttendanceIcon } from "../../../assets/icons/attendance.svg";
import { useNavigate } from "react-router";
import { SessionDetailDto } from "../../../apis/api/sessiondetail";

type OwnProps = SessionDetailDto;

const AttendanceButton: React.FC<OwnProps> = (props) => {
  const navigate = useNavigate();
  const handleNav = () => {
    // 출석부 페이지로 이동할 Router 입력
    navigate(`/session/${props.sessionId}/attendance`, {
      state: props,
    });
  };
  return (
    <button onClick={handleNav} className="ms-auto">
      <AttendanceIcon />
    </button>
  );
};

export default AttendanceButton;
