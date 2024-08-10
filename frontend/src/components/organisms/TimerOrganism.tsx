import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type OwnProps = {
  initSeconds: number;
};

const TimerOrganism: React.FC<OwnProps> = ({ initSeconds }) => {
  const [seconds, setSeconds] = useState<number>(initSeconds);

  const timerRef = useRef<number | null>(null);

  const startAndResetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => startAndResetTimer(), [startAndResetTimer]);

  const parsedSecond = useMemo(
    () =>
      `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")} : ${(seconds % 60).toString().padStart(2, "0")}`,
    [seconds]
  );

  return (
    <div className="w-full bg-[#2b2f401a] py-4 px-8 text-center disable rounded-lg font-bold">
      {parsedSecond}
    </div>
  );
};

export default TimerOrganism;
