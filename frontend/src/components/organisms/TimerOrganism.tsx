import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type OwnProps = {
  initSeconds: number;
  render: (seconds: string) => React.ReactNode;
  onEnd?: () => void;
};

const TimerOrganism: React.FC<OwnProps> = ({
  initSeconds,
  render,
  onEnd,
}) => {
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
          if (onEnd) onEnd();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  }, [onEnd]);

  useEffect(() => startAndResetTimer(), [startAndResetTimer]);

  const parsedSecond = useMemo(
    () =>
      `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")} : ${(seconds % 60).toString().padStart(2, "0")}`,
    [seconds]
  );

  return render(parsedSecond);
};

export default TimerOrganism;
