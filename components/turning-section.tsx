"use client";

import { motion } from "motion/react";

import { Sunflower } from "@/components/sunflower";
import { useDaylight } from "@/hooks/use-daylight";
import { reveal } from "@/lib/motion";

const MAX_TRACKING_DEGREES = 14;
/** Where a sunflower stands overnight: turned back to meet the sunrise. */
const EAST_DEGREES = -26;

type TurningSectionProps = {
  heading: string;
  paragraphs: readonly string[];
  aside: string;
  /** Pointer position as -1 to 1. The flower turns to meet whoever is reading. */
  tilt: { x: number; y: number };
  animated: boolean;
};

export function TurningSection({
  heading,
  paragraphs,
  aside,
  tilt,
  animated,
}: TurningSectionProps) {
  const daylight = useDaylight();

  /* The paragraph beside this flower says it turns back east overnight to face
     the morning before the morning arrives. After dark it stops answering the
     pointer and goes and does that. */
  const facing = daylight.night ? EAST_DEGREES : tilt.x * MAX_TRACKING_DEGREES;

  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 lg:py-28">
      {/* The reveal owns the outer box and the tracking stays on a plain child,
          so the two never write a transform to the same element. */}
      <motion.div className="mx-auto w-[min(78vw,22rem)]" {...reveal(animated)}>
        <div
          style={{
            transform: `rotate(${facing}deg)`,
            transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Sunflower
            tilt={tilt}
            openDelay={0}
            petalStagger={0}
            animated={false}
            className="h-full w-full"
          />
        </div>
      </motion.div>

      <motion.div {...reveal(animated, 0.12)}>
        <h2 className="font-display text-head-lg font-normal text-seed [--opsz:60]">
          {heading}
        </h2>

        <div className="mt-7 space-y-5 text-body text-seed-soft">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-[46ch]">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-10 max-w-[46ch] border-l-2 border-stem/40 pl-5 text-small text-stem italic">
          {aside}
        </p>
      </motion.div>
    </section>
  );
}
