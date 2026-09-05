"use client";

import { motion } from "motion/react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const CONTRAIL_DURATION = 2.6;

/** Where the aircraft finishes, and roughly the angle it is climbing at. */
const AIRCRAFT_X = 980;
const AIRCRAFT_Y = 22;
const AIRCRAFT_PITCH_DEGREES = -9;
const CONTRAIL_PATH = `M -20 100 C 300 88, 640 44, ${AIRCRAFT_X} ${AIRCRAFT_Y}`;

type ClosingProps = {
  greeting: string;
  nudge: string;
  date: string;
  signature: string;
  animated: boolean;
};

export function Closing({
  greeting,
  nudge,
  date,
  signature,
  animated,
}: ClosingProps) {
  return (
    <footer className="relative overflow-hidden px-6 pt-28 pb-20 lg:pt-36">
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 120"
        className="pointer-events-none absolute inset-x-0 top-6 w-full"
      >
        <defs>
          {/* The trail thins out behind the aircraft rather than stopping dead. */}
          <linearGradient id="contrail-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="45%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>

        <motion.path
          d={CONTRAIL_PATH}
          fill="none"
          stroke="url(#contrail-fade)"
          strokeWidth={3.5}
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: CONTRAIL_DURATION, ease: EASE_OUT }}
        />

        <motion.g
          transform={`translate(${AIRCRAFT_X} ${AIRCRAFT_Y}) rotate(${AIRCRAFT_PITCH_DEGREES})`}
          initial={animated ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.45,
            delay: CONTRAIL_DURATION * 0.8,
            ease: EASE_OUT,
          }}
        >
          <path d="M 4 0 L -17 6.5 L -11 0 L -17 -6.5 Z" fill="white" />
        </motion.g>
      </svg>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p className="font-display text-[clamp(2rem,5.5vw,3.5rem)] leading-tight font-normal text-balance text-seed">
          {greeting}
        </p>
        <p className="font-display mt-4 text-xl font-normal text-seed-soft italic">
          {nudge}
        </p>
        <p className="mt-10 text-sm text-seed-soft">{date}</p>
        <p className="font-display mt-2 text-lg font-normal text-seed italic">
          {signature}
        </p>
      </div>
    </footer>
  );
}
