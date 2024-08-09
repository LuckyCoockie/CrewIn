import React from "react";
import { useCallback, useState } from "react";

type OwnProps = {
  initPresent: boolean; // 출석 여부
  isAuto: boolean; // 자동 여부
  onClick?: (state: boolean) => void;
};

const AttendanceButton: React.FC<OwnProps> = ({
  initPresent,
  isAuto,
  onClick,
}) => {
  const [isPresent, setIsPresent] = useState(initPresent);

  const handleClick = useCallback(() => {
    if (onClick && !isAuto) onClick(!isPresent);
    setIsPresent(!isPresent);
  }, [isAuto, isPresent, onClick]);

  return initPresent ? (
    <button
      className="border border-gray-400 w-20 h-10 rounded-md text-sm bg-primary text-white"
      onClick={handleClick}
    >
      {isAuto ? "출석" : "수동 출석"}
    </button>
  ) : (
    !isAuto && (
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
