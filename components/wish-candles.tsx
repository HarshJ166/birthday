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
import { EASE_OUT, reveal } from "@/lib/motion";
import { GRAIN } from "@/lib/texture";

/**
 * The dark is not a decision about this section — it is what happens when she
 * lights the candles.
 *
 * A permanent dark band was the wrong answer twice over: a near-black rectangle
 * sitting in a warm paper page before anything has happened is a hole rather
 * than a room, and fading black out to nothing over paper drags the edges
 * through a dead desaturated zone that always reads as dirt. So the section
 * starts on paper like every other one, and the lights go down when she asks
 * for them.
 *
 * Radial rather than flat, because the candles are the light source and a lit
 * room is warm at the middle and darkest in the corners — a single fill reads
 * as a background colour, which is exactly what it would be.
 */
/**
 * The room is opaque and begins and ends on `#f6efe1` — the exact tone the page
 * holds from 84% down.
 *
 * The first attempt faded a near-black to transparent instead, and that is what
 * produced the grey smear: black composited over a light ground through alpha
 * is neutral grey at every step, with no hue anywhere in the middle. Ramping
 * through actual colour — cream, sand, tan, umber, then dark — means the
 * transition passes through warmth rather than through dirt, and because both
 * ends match the page exactly there is no seam left to blend.
 */
const ROOM = [
  "radial-gradient(ellipse 88% 56% at 50% 47%, rgba(140,88,34,0.5) 0%, rgba(70,42,16,0.22) 46%, rgba(0,0,0,0) 76%)",
  [
    "linear-gradient(to bottom",
    "#f6efe1 0%",
    "#e8d0aa 3%",
    "#b58449 7%",
    "#5f3c1c 12%",
    "#2b1a0b 18%",
    "#170e07 34%",
    "#170e07 66%",
    "#2b1a0b 82%",
    "#5f3c1c 88%",
    "#b58449 93%",
    "#e8d0aa 97%",
    "#f6efe1 100%)",
  ].join(", "),
].join(",");

/** The grain belongs to the dark only, so it stops before the warm ends. */
const ROOM_EDGES =
  "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)";

/** Long enough that the lights going down is felt rather than switched. */
const DIM_SECONDS = 1.4;
const DIM = `opacity ${DIM_SECONDS}s ease`;

const PAPER_INK = "#3b2a17";
const PAPER_INK_SOFT = "#6b5a45";
const ROOM_INK = "#fdfcf9";
const ROOM_INK_SOFT = "rgba(253, 252, 249, 0.66)";
/** The type changes with the light, not a beat before or after it. */
const INK_FADE = `color ${DIM_SECONDS}s ease`;

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
  granted: { greeting: string; line: string };
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

  /* The room stays down once she has struck the first match, so the flower
     blooms in the dark and only "Light them again" brings the paper back. */
  const darkened = stage !== "unlit";
  const ink = darkened ? ROOM_INK : PAPER_INK;
  const inkSoft = darkened ? ROOM_INK_SOFT : PAPER_INK_SOFT;

  return (
    <section className="relative overflow-hidden px-6 py-36 lg:py-44">
      {/* The room, and the grain that stops it banding into steps. Both are
          masked to the same soft edges so the dark never meets paper at a line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: ROOM,
          opacity: darkened ? 1 : 0,
          transition: DIM,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: GRAIN,
          maskImage: ROOM_EDGES,
          WebkitMaskImage: ROOM_EDGES,
          opacity: darkened ? 0.16 : 0,
          transition: DIM,
        }}
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        {...reveal(animated)}
      >
        <h2
          className="font-display text-head font-normal [--opsz:48]"
          style={{ color: ink, transition: INK_FADE }}
        >
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
                <stop offset="0%" stopColor="#8a6136" />
                <stop offset="100%" stopColor="#402a16" />
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
            <g fill="var(--color-petal)" opacity={0.34}>
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
                <p
                  className="font-display text-head font-normal text-balance [--opsz:48]"
                  style={{ color: ink, transition: INK_FADE }}
                >
                  {granted.greeting}
                </p>
                <p
                  className="font-display mx-auto max-w-[36ch] text-lead font-normal text-balance italic [--opsz:20]"
                  style={{ color: inkSoft, transition: INK_FADE }}
                >
                  {granted.line}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key={note}
                initial={animated ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="max-w-[46ch] text-body text-balance whitespace-pre-line"
                style={{ color: inkSoft, transition: INK_FADE }}
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
      </motion.div>
    </section>
  );
}
