"use client";

import { motion } from "motion/react";

import {
  type Bloom,
  FIELD_VIEWBOX_HEIGHT,
  FIELD_VIEWBOX_WIDTH,
  STEM_ROOT_Y,
} from "@/lib/bloom-field";
import {
  INNER_PETAL_ANGLES,
  INNER_PETAL_PATH,
  OUTER_PETAL_ANGLES,
  OUTER_PETAL_PATH,
  scatterNoise,
  SEED_HEAD_RADIUS,
  SEEDS,
} from "@/lib/sunflower-geometry";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const STEM_DURATION = 0.85;
const HEAD_DURATION = 0.7;
const HEAD_LAG = 0.28;
const MAX_TURN_DEGREES = 9;
const MAX_PARALLAX = 26;
const STEM_LEAN = 26;
const LEAF_PATH = "M 0 0 Q 34 -19 70 -2 Q 34 20 0 0 Z";
/** How far down the stem the leaves sit, as a share of its length. */
const LEAF_DROP = 0.42;

type SunflowerFieldProps = {
  blooms: readonly Bloom[];
  /** False keeps the field below ground; true grows it. */
  grown: boolean;
  /** Pointer position as -1 to 1, so the whole field turns together. */
  tilt: { x: number; y: number };
  /** Seconds between one flower coming up and the next. */
  growStagger: number;
  /** Seconds before the first stem moves. */
  growDelay: number;
  animated: boolean;
  className?: string;
};

export function SunflowerField({
  blooms,
  grown,
  tilt,
  growStagger,
  growDelay,
  animated,
  className,
}: SunflowerFieldProps) {
  return (
    <svg
      viewBox={`0 0 ${FIELD_VIEWBOX_WIDTH} ${FIELD_VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none", className)}
    >
      <defs>
        <radialGradient id="field-petal" cx="50%" cy="88%" r="72%">
          <stop offset="0%" stopColor="var(--color-sun-deep)" />
          <stop offset="45%" stopColor="var(--color-sun-core)" />
          <stop offset="100%" stopColor="var(--color-petal)" />
        </radialGradient>
        <radialGradient id="field-head" cx="38%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#6b4a26" />
          <stop offset="100%" stopColor="#2c1d0f" />
        </radialGradient>

        {/* One flower, drawn once, reused by every stalk in the field. */}
        <g id="field-bloom">
          {OUTER_PETAL_ANGLES.map((angle) => (
            <path
              key={`o-${angle}`}
              d={OUTER_PETAL_PATH}
              fill="url(#field-petal)"
              transform={`rotate(${angle})`}
            />
          ))}
          {INNER_PETAL_ANGLES.map((angle) => (
            <path
              key={`i-${angle}`}
              d={INNER_PETAL_PATH}
              fill="var(--color-sun-deep)"
              opacity={0.62}
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r={SEED_HEAD_RADIUS} fill="url(#field-head)" />
          <g fill="var(--color-petal)" opacity={0.34}>
            {SEEDS.map((seed, index) => (
              <circle key={index} cx={seed.x} cy={seed.y} r={seed.radius} />
            ))}
          </g>
        </g>
      </defs>

      {blooms.map((bloom, index) => {
        const delay = growDelay + index * growStagger;
        const sway = (scatterNoise(index + 313) - 0.5) * STEM_LEAN;
        const drift = tilt.x * MAX_PARALLAX * bloom.depth;
        const turn = tilt.x * MAX_TURN_DEGREES * bloom.depth;
        const stemWidth = Math.max(2.5, 13 * bloom.scale);
        const leafY = bloom.y + (STEM_ROOT_Y - bloom.y) * LEAF_DROP;
        const leafScale = bloom.scale * 1.15;

        return (
          <g
            key={index}
            opacity={bloom.opacity}
            style={{
              transform: `translateX(${drift.toFixed(2)}px)`,
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <motion.path
              d={`M ${bloom.x} ${STEM_ROOT_Y} Q ${bloom.x + sway} ${
                (bloom.y + STEM_ROOT_Y) / 2
              } ${bloom.x} ${bloom.y}`}
              fill="none"
              stroke="var(--color-stem)"
              strokeWidth={stemWidth}
              strokeLinecap="round"
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              initial={animated ? { scaleY: 0 } : false}
              animate={{ scaleY: grown ? 1 : 0 }}
              transition={{ duration: STEM_DURATION, delay, ease: EASE_OUT }}
            />

            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              initial={animated ? { scaleY: 0, opacity: 0 } : false}
              animate={{ scaleY: grown ? 1 : 0, opacity: grown ? 1 : 0 }}
              transition={{
                duration: STEM_DURATION,
                delay: delay + HEAD_LAG * 0.5,
                ease: EASE_OUT,
              }}
            >
              <g
                transform={`translate(${bloom.x} ${leafY}) scale(${leafScale})`}
                fill="var(--color-stem)"
                opacity={0.9}
              >
                <path d={LEAF_PATH} transform="rotate(-14)" />
                <path d={LEAF_PATH} transform="scale(-1 1) rotate(-14)" />
              </g>
            </motion.g>

            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={{
                scale: grown ? 1 : 0,
                opacity: grown ? 1 : 0,
                rotate: grown ? turn : 0,
              }}
              transition={{
                duration: HEAD_DURATION,
                delay: delay + HEAD_LAG,
                ease: EASE_OUT,
              }}
            >
              <g
                transform={`translate(${bloom.x} ${bloom.y}) scale(${bloom.scale})`}
              >
                <use href="#field-bloom" />
              </g>
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}
