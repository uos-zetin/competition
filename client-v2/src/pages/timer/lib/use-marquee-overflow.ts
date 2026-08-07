import { useEffect, useRef, useState } from "react";

export function useMarqueeOverflow(text: string, className: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const measure = () =>
      setShouldAnimate((measureRef.current?.offsetWidth ?? 0) > (containerRef.current?.clientWidth ?? 0));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [className, text]);

  return { containerRef, measureRef, shouldAnimate };
}
