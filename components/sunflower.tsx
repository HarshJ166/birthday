"use client";

import { motion } from "motion/react";

import {
  INNER_PETAL_ANGLES,
  INNER_PETAL_PATH,
  OUTER_PETAL_ANGLES,
  OUTER_PETAL_PATH,
  SEED_HEAD_RADIUS,
  SEEDS,
  SUNFLOWER_VIEWBOX,
} from "@/lib/sunflower-geometry";
import { cn } from "@/lib/utils";

const MAX_TURN_DEGREES = 15;
const PETAL_OPEN_DURATION = 0.55;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Petals grow out of their own base rather than the centre of the drawing,
 * so the flower unfurls instead of inflating.
 */
const PETAL_PIVOT = {
  transformBox: "fill-box",
  transformOrigin: "50% 100%",
} as const;

type SunflowerProps = {
  /** Pointer position as -1 to 1 on each axis. The head turns to meet it. */
  tilt: { x: number; y: number };
  /** Seconds before the first petal opens. */
  openDelay: number;
  /** Seconds between one petal opening and the next. */
  petalStagger: number;
  /** False renders the flower already open and perfectly still. */
  animated: boolean;
  className?: string;
};

export function Sunflower({
  tilt,
  openDelay,
  petalStagger,
  animated,
  className,
}: SunflowerProps) {
  const unfurl = (index: number) =>
    animated
      ? {
          initial: { scaleY: 0, opacity: 0 },
          animate: { scaleY: 1, opacity: 1 },
          transition: {
            duration: PETAL_OPEN_DURATION,
            delay: openDelay + index * petalStagger,
            ease: EASE_OUT,
          },
        }
      : {};

  return (
    <div
      className={cn("[perspective:900px]", className)}
      style={{
        transform: `rotateY(${tilt.x * MAX_TURN_DEGREES}deg) rotateX(${
          -tilt.y * MAX_TURN_DEGREES
        }deg)`,
        transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <svg
        viewBox={SUNFLOWER_VIEWBOX}
        className="h-full w-full overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="sunflower-petal" cx="50%" cy="88%" r="72%">
            <stop offset="0%" stopColor="var(--color-sun-deep)" />
            <stop offset="45%" stopColor="var(--color-sun-core)" />
            <stop offset="100%" stopColor="var(--color-petal)" />
          </radialGradient>
          <radialGradient id="sunflower-head" cx="38%" cy="34%" r="78%">
            <stop offset="0%" stopColor="#6b4a26" />
            <stop offset="100%" stopColor="#2c1d0f" />
          </radialGradient>
        </defs>

        {OUTER_PETAL_ANGLES.map((angle, index) => (
          <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
            <motion.path
              d={OUTER_PETAL_PATH}
              fill="url(#sunflower-petal)"
              style={PETAL_PIVOT}
              {...unfurl(index)}
            />
          </g>
        ))}

        {INNER_PETAL_ANGLES.map((angle, index) => (
          <g key={`inner-${angle}`} transform={`rotate(${angle})`}>
            <motion.path
              d={INNER_PETAL_PATH}
              fill="var(--color-sun-deep)"
              opacity={0.62}
              style={PETAL_PIVOT}
              {...unfurl(OUTER_PETAL_ANGLES.length + index)}
            />
          </g>
        ))}

        <circle r={SEED_HEAD_RADIUS} fill="url(#sunflower-head)" />

        <g fill="var(--color-petal)" opacity={0.34}>
          {SEEDS.map((seed, index) => (
            <circle
              key={`seed-${index}`}
              cx={seed.x}
              cy={seed.y}
              r={seed.radius}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
