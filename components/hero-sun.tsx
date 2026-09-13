"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { SunHalo } from "@/components/sun-halo";
import { useDaylight } from "@/hooks/use-daylight";
import { groundGlow, halation } from "@/lib/daylight";
import { EASE_OUT } from "@/lib/motion";
import { GRAIN } from "@/lib/texture";
import { scatterNoise } from "@/lib/sunflower-geometry";

/* One arrival, in the order the eye should take it: the light comes up, she
   appears inside it, her name rises letter by letter, then the words. */
const PORTRAIT_DELAY = 0.3;
const NAME_DELAY = 0.72;
const LETTER_STAGGER = 0.055;
const RULE_DELAY = 1.32;
const LINES_DELAY = 1.46;
const META_DELAY = 1.66;

/* How far each layer answers the pointer. Depth is only ever the difference
   between these numbers, so they are set as a series, not tuned one by one.
   The bloom outruns the disc by a long way: the light sweeps the whole sky
   while the sun itself keeps to its pocket beside the arch, clear of the type
   it would otherwise wander into. */
const BLOOM_TRAVEL_PX = 150;
const SUN_TRAVEL_PX = 44;
const PORTRAIT_TRAVEL_PX = 24;
const NAME_TRAVEL_PX = 9;

/* A wave running through the letters, phase advancing along the word and the
   whole thing travelling as the pointer crosses. Amplitude is scaled by how
   far the pointer is off-centre, so at rest the name sits dead level. */
const SWAY_PEAK_PX = 10;
const SWAY_PHASE_PER_LETTER = 0.8;
const SWAY_TRAVEL_PER_POINTER = 2.4;

/* Leaving is one movement at three speeds — the light goes with the scroll,
   the words go against it, and she stays nearly put. That is depth. */
const LIGHT_SCROLL_DRIFT_PX = 180;
const PORTRAIT_SCROLL_DRIFT_PX = 58;
const WORDS_SCROLL_LIFT_PX = -108;
/** Fraction of the hero's exit by which the words have gone entirely. */
const WORDS_GONE_AT = 0.7;

/** Long and heavily eased: the sun is being followed, not dragged. */
const GLIDE = "transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)";

/** A slow push on the photograph, so the frame is never quite still. */
const BREATH_SECONDS = 26;
/** The disc swells about its own width every few seconds. Barely a motion. */
const SUN_PULSE_SECONDS = 7;

/** An arch, struck as ellipses so it keeps its proportion at any width. */
const ARCH = "48% 48% 0 0 / 32% 32% 0 0";
/** The photograph is not cropped at the bottom, it dissolves into the sky —
    but late and quickly, so it reads as haze rather than as an unfinished
    picture. Everything above 70% is hers, untouched. */
const DISSOLVE =
  "linear-gradient(to bottom, #000 0%, #000 70%, transparent 97%)";

/* Every surface below is a long CSS string; they live here rather than in the
   markup so the structure of the hero stays readable at a glance. */

/** How many stars come out, and the seeded scatter that places them. Seeded
    rather than random so the sky is the same sky on every render. */
const STAR_COUNT = 46;
const STARS = Array.from({ length: STAR_COUNT }, (_, index) => ({
  left: scatterNoise(index * 3 + 1) * 100,
  /* Kept to the dark top third — a star over the paper would just be a speck. */
  top: scatterNoise(index * 3 + 2) * 34,
  size: 1 + scatterNoise(index * 3 + 3) * 1.6,
  twinkle: 2.4 + scatterNoise(index * 5 + 7) * 3.5,
}));

/** Long enough that a phase turning over while she is reading reads as the
    light changing, not as the picture being swapped. */
const RELIGHT = "2400ms ease";

/** Paper with a little petal in it — the sky's own tone at the height where the
    arch stands, so the name crosses a lit edge rather than a cut one. */
const CROSSING_TONE =
  "color-mix(in srgb, var(--color-paper) 78%, var(--color-petal))";
const NAME_CROSSING_SCRIM = `linear-gradient(to right, ${CROSSING_TONE} 0%, color-mix(in srgb, ${CROSSING_TONE} 50%, transparent) 46%, transparent 100%)`;

/** Takes the whole hero — sky, wash, grain and photograph alike — back to paper,
    so the section below starts on the colour this one ended on. */
const FOOT_FADE =
  "linear-gradient(to top, var(--color-paper) 0%, color-mix(in srgb, var(--color-paper) 72%, transparent) 42%, transparent 100%)";

type Portrait = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Where the crop holds, on a phone and on a desktop respectively. */
  object: string;
  objectLg: string;
};

type HeroSunProps = {
  name: string;
  fullName: string;
  portraits: { day: Portrait; night: Portrait };
  openingLines: readonly string[];
  dateLabel: string;
  ageLabel: string;
  /** Pointer position as -1 to 1 on each axis. Everything here leans to it. */
  tilt: { x: number; y: number };
  animated: boolean;
};

export function HeroSun({
  name,
  fullName,
  portraits,
  openingLines,
  dateLabel,
  ageLabel,
  tilt,
  animated,
}: HeroSunProps) {
  const daylight = useDaylight();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });

  const lightY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, LIGHT_SCROLL_DRIFT_PX],
  );
  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PORTRAIT_SCROLL_DRIFT_PX],
  );
  const wordsY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, WORDS_SCROLL_LIFT_PX],
  );
  const wordsFade = useTransform(scrollYProgress, [0, WORDS_GONE_AT], [1, 0]);
  const leaving = animated ? { y: wordsY, opacity: wordsFade } : undefined;

  const arrive = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE_OUT },
        }
      : {};

  const lean = (travel: number) =>
    `translate3d(${(tilt.x * travel).toFixed(1)}px, ${(tilt.y * travel).toFixed(1)}px, 0)`;

  const swayOf = (index: number) =>
    Math.sin(index * SWAY_PHASE_PER_LETTER + tilt.x * SWAY_TRAVEL_PER_POINTER) *
    SWAY_PEAK_PX *
    Math.abs(tilt.x);

  return (
    <section
      ref={hero}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden lg:block"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{ background: daylight.sky }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{ background: daylight.horizon }}
      />

      {/* Stars, and only after dark. */}
      {daylight.night ? (
        <div aria-hidden="true" className="absolute inset-0 -z-20">
          {STARS.map((star, index) => (
            <motion.span
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
              }}
              animate={
                animated ? { opacity: [0.25, 0.9, 0.25] } : { opacity: 0.6 }
              }
              transition={{
                duration: star.twinkle,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : null}

      {/* The sun itself, standing wherever the clock says it stands. It is also
          the one thing on this page that belongs to whoever is reading — it
          goes where the pointer goes, or where the phone is tilted. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[var(--sun-top)] left-[var(--sun-left)] -z-20 lg:top-[var(--sun-lg-top)] lg:left-[var(--sun-lg-left)]"
        style={
          {
            "--sun-top": daylight.top,
            "--sun-left": daylight.left,
            "--sun-lg-top": daylight.lgTop,
            "--sun-lg-left": daylight.lgLeft,
            ...(animated ? { y: lightY } : {}),
          } as React.CSSProperties
        }
      >
        <div style={{ transform: lean(BLOOM_TRAVEL_PX), transition: GLIDE }}>
          <motion.div
            className="absolute aspect-square w-[min(150vw,62rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: daylight.bloom }}
            initial={animated ? { opacity: 0, scale: 0.86 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: EASE_OUT }}
          />
        </div>

        {/* On a phone the disc keeps to the band above the arch, so it reads as
            sky behind her rather than a lamp planted in the middle of the copy. */}
        <div style={{ transform: lean(SUN_TRAVEL_PX), transition: GLIDE }}>
          <SunHalo
            animated={animated}
            className="absolute aspect-square w-[min(64vw,23rem)] -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: daylight.night ? 0.12 : 0.4 }}
          />

          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={animated ? { opacity: 0, scale: 0.7 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT }}
          >
            <motion.span
              className="block size-[clamp(2rem,5vw,4.5rem)] rounded-full"
              style={{
                background: daylight.disc,
                boxShadow: halation(daylight.disc, daylight.night ? 26 : 50),
              }}
              animate={animated ? { scale: [1, 1.045, 1] } : undefined}
              transition={{
                duration: SUN_PULSE_SECONDS,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Her face leads on a phone. Landing on a page of type is the one thing
          a hero must never do — and she takes whatever height the words leave,
          so a tall screen grows the photograph rather than a gap beneath it. */}
      <motion.div
        className="relative flex min-h-[50svh] w-full flex-1 lg:absolute lg:inset-y-0 lg:right-[4%] lg:h-full lg:w-[38%] lg:min-h-0 lg:flex-none xl:right-[6%] xl:w-[35%]"
        style={animated ? { y: portraitY } : undefined}
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: PORTRAIT_DELAY, ease: EASE_OUT }}
      >
        <div
          className="w-full px-6 pt-6 sm:px-12 lg:px-0 lg:pt-[7svh]"
          style={{ transform: lean(PORTRAIT_TRAVEL_PX), transition: GLIDE }}
        >
          <motion.div
            className="relative h-full w-full"
            initial={animated ? { scaleY: 0.82, opacity: 0 } : false}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: 1.3,
              delay: PORTRAIT_DELAY,
              ease: EASE_OUT,
            }}
            style={{ originY: 1 }}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: ARCH,
                maskImage: DISSOLVE,
                WebkitMaskImage: DISSOLVE,
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={animated ? { scale: 1.12 } : false}
                animate={
                  animated ? { scale: [1.05, 1.01, 1.05] } : { scale: 1 }
                }
                transition={
                  animated
                    ? {
                        scale: {
                          duration: BREATH_SECONDS,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                    : undefined
                }
              >
                {([portraits.day, portraits.night] as const).map(
                  (portrait, index) => {
                    const showing =
                      index === 1 ? daylight.night : !daylight.night;

                    return (
                      <Image
                        key={portrait.src}
                        src={portrait.src}
                        width={portrait.width}
                        height={portrait.height}
                        alt={showing ? portrait.alt : ""}
                        aria-hidden={!showing}
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        loading="eager"
                        fetchPriority={index === 0 ? "high" : "low"}
                        className="absolute inset-0 h-full w-full object-cover object-[var(--obj)] lg:object-[var(--obj-lg)]"
                        style={
                          {
                            "--obj": portrait.object,
                            "--obj-lg": portrait.objectLg,
                            filter: daylight.photoFilter,
                            opacity: showing ? 1 : 0,
                            transition: `filter ${RELIGHT}, opacity ${RELIGHT}`,
                          } as React.CSSProperties
                        }
                      />
                    );
                  },
                )}
              </motion.div>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: daylight.photoTint,
                  mixBlendMode: daylight.photoBlend,
                  transition: `background ${RELIGHT}`,
                }}
              />

              {/* The name crosses this edge, so the edge gives way to it. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-32 lg:block"
                style={{ background: NAME_CROSSING_SCRIM }}
              />
            </div>

            {/* A hairline struck on the same arch, fading out with it. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border border-sun-deep/40"
              style={{
                borderRadius: ARCH,
                maskImage: DISSOLVE,
                WebkitMaskImage: DISSOLVE,
              }}
            />

            {/* The ground. Outside the mask, or it would dissolve along with
                the thing it is holding up. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[-14%] bottom-0 h-[22%]"
              style={{
                background: groundGlow(daylight.disc),
                transition: `background ${RELIGHT}`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Above the photograph, below the words: the foot fade has to take her
          bottom edge with it, but must never wash out the type. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[20%]"
        style={{ background: FOOT_FADE }}
      />

      <motion.div
        className="relative z-10 -mt-[7svh] flex flex-col px-7 pb-16 sm:px-12 lg:absolute lg:inset-y-0 lg:left-[5%] lg:mt-0 lg:w-[64%] lg:justify-center lg:px-0 lg:pb-0 xl:left-[7%]"
        style={leaving}
      >
        <h1
          className="font-display text-hero font-normal text-bark [--opsz:120]"
          style={{ transform: lean(NAME_TRAVEL_PX), transition: GLIDE }}
        >
          <span className="sr-only">{fullName}</span>
          {/* Each letter rides in its own mask, which is also what lets the sway
              move them independently. The em padding keeps the descender of the
              y inside the mask instead of shearing it off. */}
          <span aria-hidden="true" className="flex">
            {name.split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="overflow-hidden pb-[0.24em] -mb-[0.24em]"
                style={{
                  transform: `translateY(${swayOf(index).toFixed(2)}px)`,
                  transition: GLIDE,
                }}
              >
                <motion.span
                  className="block"
                  initial={animated ? { y: "115%" } : false}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.95,
                    delay: NAME_DELAY + index * LETTER_STAGGER,
                    ease: EASE_OUT,
                  }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.span
          aria-hidden="true"
          className="mt-8 block h-px w-[min(28rem,72%)] origin-left"
          style={{
            background:
              "linear-gradient(to right, var(--color-sun-deep), color-mix(in srgb, var(--color-ember) 55%, transparent) 45%, transparent)",
          }}
          initial={animated ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: RULE_DELAY, ease: EASE_OUT }}
        />

        <motion.p
          className="mt-7 max-w-[24ch] text-lead text-seed sm:text-lead-lg"
          {...arrive(LINES_DELAY)}
        >
          {openingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.p>

        <motion.div
          className="mt-9 flex items-center gap-4 text-small text-seed-soft"
          {...arrive(META_DELAY)}
        >
          <span>{dateLabel}</span>
          <span aria-hidden="true" className="h-4 w-px bg-seed/20" />
          <span>{ageLabel}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
