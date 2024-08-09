import React from "react";
import { useCallback, useState } from "react";

type OwnProps = {
  initPresent: boolean; // 출석 여부
  isAttendanceStarted: boolean; // 자동 여부
  onClick?: (state: boolean) => void;
};

const AttendanceButton: React.FC<OwnProps> = ({
  initPresent,
  isAttendanceStarted,
  onClick,
}) => {
  const [isPresent, setIsPresent] = useState(initPresent);

  const handleClick = useCallback(() => {
    if (onClick && isAttendanceStarted) onClick(!isPresent);
    setIsPresent(!isPresent);
  }, [isAttendanceStarted, isPresent, onClick]);

  return initPresent ? (
    <button
      className="border border-gray-400 w-20 h-10 rounded-md text-sm bg-primary text-white"
      onClick={handleClick}
    >
      {"출석"}
    </button>
  ) : (
    isAttendanceStarted && (
      <button
        className="border border-gray-400 w-20 h-10 rounded-md text-sm"
        onClick={handleClick}
      >
        {"미출석"}
      </button>
    )
  );
};

export default React.memo(AttendanceButton);
