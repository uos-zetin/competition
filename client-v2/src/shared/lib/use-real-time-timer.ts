import { useEffect, useRef, useState } from "react";

export function useRealTimeTimer<T>(
  startedAt: number | null,
  stoppedAt: number | null,
  calculateValue: (startedAt: number | null, stoppedAt: number | null, now: number) => T
): T {
  const [value, setValue] = useState<T>(() => calculateValue(startedAt, stoppedAt, Date.now()));
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setValue(calculateValue(startedAt, stoppedAt, Date.now()));
      if (startedAt !== null && stoppedAt === null) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [calculateValue, startedAt, stoppedAt]);

  return value;
}
