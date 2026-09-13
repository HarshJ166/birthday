"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * The hero's sky follows the real clock — open it at midnight and it is
 * actually dark. Everything below the hero instead runs on a clock of its
 * own: her scroll position. One pass down the page is one day, dawn at the
 * top and night by the candles, so the same page keeps changing without
 * ever hijacking the scroll itself.
 *
 * Each phase is a single flat tint laid over the page in `multiply`, not the
 * hero's full sky gradient — multiply only ever darkens toward the tint, so
 * the seed-brown text above stays legible at every stop instead of the risk
 * a real navy night sky would run into. Five tints, evenly spaced, crossfade
 * as a triangular wave over the scroll range — a lighter version of the
 * hero's own day/night crossfade technique.
 */
const PHASES = [
  { key: "morning", color: "var(--color-sky)", opacity: 0.16 },
  { key: "midday", color: "var(--color-petal)", opacity: 0.14 },
  { key: "golden", color: "var(--color-amber)", opacity: 0.16 },
  { key: "dusk", color: "var(--color-dusk)", opacity: 0.2 },
  { key: "night", color: "#1c2340", opacity: 0.24 },
] as const;

/** Where the little sun sits vertically as she scrolls, top to bottom. */
const SUN_TRAVEL = ["4%", "94%"];

function Layer({
  phase,
  index,
  dayIndex,
}: {
  phase: (typeof PHASES)[number];
  index: number;
  dayIndex: MotionValue<number>;
}) {
  const opacity = useTransform(dayIndex, (value) =>
    Math.max(0, 1 - Math.abs(value - index)) * phase.opacity,
  );

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: phase.color, mixBlendMode: "multiply", opacity }}
    />
  );
}

type AmbientSkyProps = {
  animated: boolean;
  children: React.ReactNode;
};

export function AmbientSky({ animated, children }: AmbientSkyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const dayIndex = useTransform(scrollYProgress, (value) => value * (PHASES.length - 1));
  const sunTop = useTransform(scrollYProgress, [0, 1], SUN_TRAVEL);

  return (
    <div ref={ref} className="relative">
      {animated ? (
        <div
          aria-hidden="true"
          className="pointer-events-none sticky top-0 -mb-[100vh] h-screen w-full overflow-hidden"
        >
          {PHASES.map((phase, index) => (
            <Layer key={phase.key} phase={phase} index={index} dayIndex={dayIndex} />
          ))}

          {/* A small light travelling down the margin — the same sun as the
              hero, just answering scroll instead of the clock now. */}
          <motion.span
            className="absolute right-5 size-2.5 rounded-full bg-sun-core sm:right-10"
            style={{
              top: sunTop,
              boxShadow:
                "0 0 1.75rem 0.4rem color-mix(in srgb, var(--color-sun-core) 40%, transparent)",
            }}
          />
        </div>
      ) : null}

      {children}
    </div>
  );
}
