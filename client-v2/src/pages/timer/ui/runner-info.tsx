import Marquee from "react-fast-marquee";

import { progressService } from "@/features/progress";

import { useMarqueeOverflow } from "../lib/use-marquee-overflow";

export function RunnerInfo() {
  const participant = progressService.use.runner()?.participant;
  const name = participant ? `${participant.name} · ${participant.robotName}` : "—";
  const nameClassName = "text-[clamp(.95rem,2.55cqi,2.25rem)] font-extrabold whitespace-nowrap";
  const { containerRef, measureRef, shouldAnimate } = useMarqueeOverflow(name, nameClassName);

  return (
    <>
      <div ref={containerRef} className="w-full overflow-hidden text-center">
        <span ref={measureRef} className={`invisible fixed ${nameClassName}`}>
          {name}
        </span>
        {shouldAnimate ? (
          <Marquee speed={128} gradient gradientWidth={80} gradientColor="var(--background)" className={nameClassName}>
            <span className="pr-14">{name}</span>
          </Marquee>
        ) : (
          <p className={nameClassName}>{name}</p>
        )}
      </div>
      <p className="mt-[clamp(.1rem,.3cqi,.3rem)] w-full truncate text-[clamp(.7rem,1.3cqi,1.1rem)] text-muted-foreground">
        {participant?.teamName ?? "—"}
      </p>
    </>
  );
}
