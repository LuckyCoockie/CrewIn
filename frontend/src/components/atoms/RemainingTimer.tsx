import React, { useState, useEffect } from "react";

type TimerProps = {
  startAt: string;
};

const RemainingTimer: React.FC<TimerProps> = ({ startAt }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(startAt) - +new Date();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startAt]);

  return (
    <div
      className="font-normal"
      style={{ color: "lightgray", fontSize: "12px" }}
    >
      {timeLeft.days > 0 && `${timeLeft.days}일 `}
      {timeLeft.hours > 0 && `${timeLeft.hours}시간 `}
      {timeLeft.minutes > 0 && `${timeLeft.minutes}분 `}
      {timeLeft.seconds > 0 && `${timeLeft.seconds}초 남음`}
    </div>
  );
};

export default RemainingTimer;
