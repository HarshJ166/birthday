"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";

import { daysUntil } from "@/lib/countdown";
import { EASE_OUT, reveal } from "@/lib/motion";

/** The day does not turn over while she is looking at it. */
const noSubscription = () => () => {};

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
  onTheDay: string;
  untilNext: string;
  birthday: { month: number; day: number };
  animated: boolean;
};

export function Closing({
  greeting,
  nudge,
  date,
  signature,
  onTheDay,
  untilNext,
  birthday,
  animated,
}: ClosingProps) {
  /* The server does not know what day it is where she is, so it renders nothing
     and the real count lands on hydration. */
  const days = useSyncExternalStore(
    noSubscription,
    () => daysUntil(birthday.month, birthday.day, new Date()),
    () => null,
  );

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
            <stop
              offset="0%"
              stopColor="var(--color-sun-deep)"
              stopOpacity="0"
            />
            <stop
              offset="45%"
              stopColor="var(--color-sun-deep)"
              stopOpacity="0.45"
            />
            <stop
              offset="100%"
              stopColor="var(--color-sun-deep)"
              stopOpacity="0.9"
            />
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
          <path
            d="M 4 0 L -17 6.5 L -11 0 L -17 -6.5 Z"
            fill="var(--color-ember-ink)"
          />
        </motion.g>
      </svg>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.h2
          className="font-display text-head font-normal text-balance text-seed [--opsz:48]"
          {...reveal(animated)}
        >
          {greeting}
        </motion.h2>
        <motion.p
          className="font-display mt-4 text-lead font-normal text-seed-soft italic [--opsz:20]"
          {...reveal(animated, 0.1)}
        >
          {nudge}
        </motion.p>
        <motion.p
          className="mt-10 text-micro text-seed-soft"
          {...reveal(animated, 0.2)}
        >
          {date}
        </motion.p>
        <motion.p
          className="font-display mt-2 text-lead font-normal text-seed italic [--opsz:18]"
          {...reveal(animated, 0.28)}
        >
          {signature}
        </motion.p>

        {/* Reserved height, so the line arriving on mount never shifts the
            signature above it. */}
        <p className="mt-10 flex min-h-6 items-center text-micro text-seed-soft">
          {days === null
            ? null
            : days === 0
              ? onTheDay
              : `${days} ${days === 1 ? "day" : "days"} ${untilNext}`}
        </p>
      </div>
    </footer>
  );
}
