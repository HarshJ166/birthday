"use client";

import { motion } from "motion/react";

import { scatterNoise } from "@/lib/sunflower-geometry";
import { cn } from "@/lib/utils";

const DRIFT_MIN_SECONDS = 14;
const DRIFT_RANGE_SECONDS = 12;
const RISE_DISTANCE = 44;
const MOTE_MIN_SIZE = 3;
const MOTE_SIZE_RANGE = 5;
const POSITION_PRECISION = 2;
const SIZE_PRECISION = 1;

type PollenFieldProps = {
  /** How many motes to hang in the air. */
  count: number;
  /** False hides the drift entirely — this is pure atmosphere, so it just goes. */
  animated: boolean;
  className?: string;
};

export function PollenField({ count, animated, className }: PollenFieldProps) {
  if (!animated) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => {
        const size = MOTE_MIN_SIZE + scatterNoise(index + 83) * MOTE_SIZE_RANGE;
        const duration =
          DRIFT_MIN_SECONDS + scatterNoise(index + 127) * DRIFT_RANGE_SECONDS;
        const drift = (scatterNoise(index + 199) - 0.5) * RISE_DISTANCE;

        return (
          <motion.span
            key={index}
            className="absolute rounded-full bg-sun-core"
            style={{
              left: `${(scatterNoise(index + 1) * 100).toFixed(POSITION_PRECISION)}%`,
              top: `${(scatterNoise(index + 41) * 100).toFixed(POSITION_PRECISION)}%`,
              width: `${size.toFixed(SIZE_PRECISION)}px`,
              height: `${size.toFixed(SIZE_PRECISION)}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, -RISE_DISTANCE],
              x: [0, drift],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: scatterNoise(index + 271) * duration,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}
