"use client";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import type { WishStage } from "@/hooks/use-wish";
import {
  CANDLES,
  PETAL_SQUASH,
  SEED_PLATE_RADIUS_X,
  SEED_PLATE_RADIUS_Y,
} from "@/lib/candles";
import {
  INNER_PETAL_ANGLES,
  INNER_PETAL_PATH,
  OUTER_PETAL_ANGLES,
  OUTER_PETAL_PATH,
  scatterNoise,
  SEEDS,
} from "@/lib/sunflower-geometry";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const FLAME_ORIGIN_LIFT = 3;
const LIGHT_SWEEP_SECONDS = 0.9;
const BLOW_SWEEP_SECONDS = 0.85;
const FLICKER_BASE_SECONDS = 0.85;
const SMOKE_RISE = 30;
const PETAL_BLOOM_STAGGER = 0.035;
/** The plate has to be wide enough to stand 23 candles on, so the petals are
    scaled past it — otherwise the bloom barely clears the rim. */
const PETAL_SCALE = 1.36;
const SPARK_COUNT = 14;
const SPARK_RISE = 120;

/** A teardrop flame, drawn sitting on its own wick. */
const FLAME_PATH =
  "M 0 0 C -3.4 -3.4, -3.6 -8.6, 0 -13 C 3.6 -8.6, 3.4 -3.4, 0 0 Z";

type WishCandlesProps = {
  heading: string;
  note: string;
  actionLabel: string;
  granted: readonly string[];
  stage: WishStage;
  onAdvance: () => void;
  animated: boolean;
};

export function WishCandles({
  heading,
  note,
  actionLabel,
  granted,
  stage,
  onAdvance,
  animated,
}: WishCandlesProps) {
  const alight = stage === "lit" || stage === "blowing";
  const flamesOut = stage === "blowing" || stage === "granted";
  const bloomed = stage === "granted";

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.5rem)] leading-tight font-normal text-seed">
          {heading}
        </h2>

        <div className="relative mt-10 w-[min(94vw,40rem)]">
          {/* The light the candles actually throw. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-[58%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-sun-core) 55%, transparent) 0%, color-mix(in srgb, var(--color-sun-deep) 22%, transparent) 45%, transparent 72%)",
            }}
            animate={{ opacity: alight ? 1 : bloomed ? 0.45 : 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          />

          <svg
            viewBox="-152 -92 304 160"
            aria-hidden="true"
            focusable="false"
            className="relative w-full overflow-visible"
          >
            <defs>
              <radialGradient id="candle-flame" cx="50%" cy="72%" r="62%">
                <stop offset="0%" stopColor="#fffdf2" />
                <stop offset="42%" stopColor="#ffd85c" />
                <stop offset="100%" stopColor="#f08a1c" />
              </radialGradient>
              <linearGradient id="candle-wax" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fffaf0" />
                <stop offset="55%" stopColor="#fdf0d6" />
                <stop offset="100%" stopColor="#e4cfae" />
              </linearGradient>
              <radialGradient id="candle-plate" cx="38%" cy="30%" r="82%">
                <stop offset="0%" stopColor="#6b4a26" />
                <stop offset="100%" stopColor="#2c1d0f" />
              </radialGradient>
              <radialGradient id="candle-petal" cx="50%" cy="88%" r="72%">
                <stop offset="0%" stopColor="var(--color-sun-deep)" />
                <stop offset="45%" stopColor="var(--color-sun-core)" />
                <stop offset="100%" stopColor="var(--color-petal)" />
              </radialGradient>
            </defs>

            {/* The reward: the flower opens once the wish is made. Squashed to
                the same angle as the plate so it sits in the same world. */}
            <g
              transform={`scale(${PETAL_SCALE} ${PETAL_SCALE * PETAL_SQUASH})`}
            >
              {OUTER_PETAL_ANGLES.map((angle, index) => (
                <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
                  <motion.path
                    d={OUTER_PETAL_PATH}
                    fill="url(#candle-petal)"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "50% 100%",
                    }}
                    initial={animated ? { scaleY: 0, opacity: 0 } : false}
                    animate={{
                      scaleY: bloomed ? 1 : 0,
                      opacity: bloomed ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: bloomed ? index * PETAL_BLOOM_STAGGER : 0,
                      ease: EASE_OUT,
                    }}
                  />
                </g>
              ))}
              {INNER_PETAL_ANGLES.map((angle, index) => (
                <g key={`inner-${angle}`} transform={`rotate(${angle})`}>
                  <motion.path
                    d={INNER_PETAL_PATH}
                    fill="var(--color-sun-deep)"
                    opacity={0.55}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "50% 100%",
                    }}
                    initial={animated ? { scaleY: 0 } : false}
                    animate={{ scaleY: bloomed ? 1 : 0 }}
                    transition={{
                      duration: 0.7,
                      delay: bloomed
                        ? (OUTER_PETAL_ANGLES.length + index) *
                          PETAL_BLOOM_STAGGER
                        : 0,
                      ease: EASE_OUT,
                    }}
                  />
                </g>
              ))}
            </g>

            <ellipse
              rx={SEED_PLATE_RADIUS_X}
              ry={SEED_PLATE_RADIUS_Y}
              fill="url(#candle-plate)"
            />
            <g fill="var(--color-petal)" opacity={0.26}>
              {SEEDS.map((seed, index) => (
                <circle
                  key={index}
                  cx={seed.x * 2.1}
                  cy={seed.y * 2.1 * PETAL_SQUASH}
                  r={seed.radius * 0.85}
                />
              ))}
            </g>

            {CANDLES.map((candle) => {
              const wickTop = candle.y - candle.height;
              const flameY = wickTop - FLAME_ORIGIN_LIFT;
              const lightDelay = candle.sweep * LIGHT_SWEEP_SECONDS;
              const blowDelay = candle.sweep * BLOW_SWEEP_SECONDS;
              const flickerSpeed =
                FLICKER_BASE_SECONDS + scatterNoise(candle.id + 5) * 0.5;

              return (
                <g key={candle.id}>
                  <rect
                    x={candle.x - candle.width / 2}
                    y={wickTop}
                    width={candle.width}
                    height={candle.height}
                    rx={candle.width / 2.4}
                    fill="url(#candle-wax)"
                  />
                  <path
                    d={`M ${candle.x} ${wickTop} L ${candle.x} ${wickTop - 3.4}`}
                    stroke="#4a3722"
                    strokeWidth={1}
                    strokeLinecap="round"
                  />

                  <motion.g
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "50% 100%",
                    }}
                    initial={animated ? { scale: 0, opacity: 0 } : false}
                    animate={{
                      scale: alight ? 1 : 0,
                      opacity: alight ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.34,
                      delay: alight ? lightDelay : blowDelay,
                      ease: EASE_OUT,
                    }}
                  >
                    <g transform={`translate(${candle.x} ${flameY})`}>
                      <circle
                        r={11}
                        fill="var(--color-sun-core)"
                        opacity={0.22}
                      />
                      <motion.g
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "50% 100%",
                        }}
                        animate={
                          animated && stage === "lit"
                            ? {
                                scaleY: [1, 1.16, 0.93, 1.09, 1],
                                scaleX: [1, 0.93, 1.06, 0.96, 1],
                              }
                            : undefined
                        }
                        transition={{
                          duration: flickerSpeed,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path d={FLAME_PATH} fill="url(#candle-flame)" />
                        <path
                          d={FLAME_PATH}
                          fill="#fffdf2"
                          opacity={0.85}
                          transform="scale(0.42)"
                        />
                      </motion.g>
                    </g>
                  </motion.g>

                  {/* Smoke, only on the way out. */}
                  {animated && flamesOut ? (
                    <motion.circle
                      cx={candle.x}
                      cy={flameY - 4}
                      r={2.4}
                      fill="#8d8578"
                      initial={{ opacity: 0, y: 0 }}
                      animate={{
                        opacity: [0, 0.4, 0],
                        y: -SMOKE_RISE,
                        x: (scatterNoise(candle.id + 61) - 0.5) * 14,
                        scale: [0.6, 1.9],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: blowDelay,
                        ease: "easeOut",
                      }}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {/* A little lift the moment the wish lands. */}
          {animated && bloomed
            ? Array.from({ length: SPARK_COUNT }, (_, index) => (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[38%] left-1/2 h-1.5 w-1.5 rounded-full bg-sun-core"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: (scatterNoise(index + 17) - 0.5) * 260,
                    y: -SPARK_RISE * (0.55 + scatterNoise(index + 91) * 0.8),
                  }}
                  transition={{
                    duration: 1.6 + scatterNoise(index + 43),
                    delay: 0.25 + index * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))
            : null}
        </div>

        <div
          aria-live="polite"
          className="mt-10 mb-8 flex min-h-[6rem] w-full items-start justify-center"
        >
          <AnimatePresence mode="wait">
            {stage === "granted" ? (
              <motion.div
                key="granted"
                initial={animated ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
                className="space-y-4"
              >
                {granted.map((line) => (
                  <p
                    key={line}
                    className="font-display mx-auto max-w-[36ch] text-xl leading-snug font-normal text-balance text-seed"
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ) : (
              <motion.p
                key={note}
                initial={animated ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-balance text-seed-soft"
              >
                {note}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button
          size="lg"
          onClick={onAdvance}
          disabled={stage === "blowing"}
          className="h-12 cursor-pointer rounded-full bg-sun-core px-8 text-base font-medium text-seed shadow-none hover:bg-sun-deep focus-visible:ring-sun-deep disabled:opacity-70"
        >
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}
