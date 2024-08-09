import React from "react";
import { useCallback, useState } from "react";

type OwnProps = {
  initPresent: boolean; // 출석 여부
  isAutoAttendanceEnded: boolean; // 자동 여부
  onClick?: (state: boolean) => void;
};

const AttendanceButton: React.FC<OwnProps> = ({
  initPresent,
  isAutoAttendanceEnded,
  onClick,
}) => {
  const [isPresent, setIsPresent] = useState(initPresent);

  const handleClick = useCallback(() => {
    if (onClick && isAutoAttendanceEnded) onClick(!isPresent);
    setIsPresent(!isPresent);
  }, [isAutoAttendanceEnded, isPresent, onClick]);

  return initPresent ? (
    <button
      className="border border-gray-400 w-20 h-10 rounded-md text-sm bg-primary text-white"
      onClick={handleClick}
    >
      {"출석"}
    </button>
  ) : (
    isAutoAttendanceEnded && (
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
