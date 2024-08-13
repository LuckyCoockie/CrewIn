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

  const isLessThanOneHour = timeLeft.days === 0 && timeLeft.hours < 1;
  const isLessThanOneDay = timeLeft.days === 0;

  return (
    <div
      className="font-normal"
      style={{
        color: isLessThanOneHour ? "red" : "gray",
        fontSize: "12px",
      }}
    >
      {timeLeft.days > 0 && `${timeLeft.days}일 남음`}
      {isLessThanOneDay && `${String(timeLeft.hours).padStart(2, "0")}:`}
      {isLessThanOneDay && `${String(timeLeft.minutes).padStart(2, "0")}:`}
      {isLessThanOneDay && `${String(timeLeft.seconds).padStart(2, "0")}`}
    </div>
  );
};

export default RemainingTimer;
