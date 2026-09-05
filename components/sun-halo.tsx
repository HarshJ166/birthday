"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const RAY_COUNT = 44;
const RAY_INNER_RADIUS = 30;
const RAY_OUTER_RADIUS = 100;
const RAY_HALF_WIDTH = 1.5;
const ROTATION_SECONDS = 90;

/** A thin spoke, drawn pointing up, ready to be rotated into place. */
const RAY_PATH = `M ${-RAY_HALF_WIDTH} ${-RAY_INNER_RADIUS} L ${-RAY_HALF_WIDTH * 0.35} ${-RAY_OUTER_RADIUS} L ${RAY_HALF_WIDTH * 0.35} ${-RAY_OUTER_RADIUS} L ${RAY_HALF_WIDTH} ${-RAY_INNER_RADIUS} Z`;

const RAY_ANGLES = Array.from(
  { length: RAY_COUNT },
  (_, index) => (index * 360) / RAY_COUNT,
);

type SunHaloProps = {
  /** False leaves the rays perfectly still. */
  animated: boolean;
  className?: string;
};

export function SunHalo({ animated, className }: SunHaloProps) {
  return (
    <motion.svg
      viewBox="-110 -110 220 220"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none", className)}
      animate={animated ? { rotate: 360 } : undefined}
      transition={{
        duration: ROTATION_SECONDS,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <g fill="var(--color-sun-deep)" opacity={0.16}>
        {RAY_ANGLES.map((angle) => (
          <path key={angle} d={RAY_PATH} transform={`rotate(${angle})`} />
        ))}
      </g>
    </motion.svg>
  );
}
