import React from "react";
import { ReactComponent as AttendanceIcon } from "../../../assets/icons/attendance.svg";
import { useNavigate } from "react-router";

const AttendanceButton: React.FC = () => {
  const navigate = useNavigate();
  const handleNav = () => {
    // 출석부 페이지로 이동할 Router 입력
    navigate(`/`);
  };
  return (
    <button onClick={handleNav} className="ms-auto">
      <AttendanceIcon />
    </button>
  );
};

export default AttendanceButton;
