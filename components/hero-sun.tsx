"use client";

import { motion } from "motion/react";

import { PollenField } from "@/components/pollen-field";
import { SunHalo } from "@/components/sun-halo";
import { SunflowerField } from "@/components/sunflower-field";
import { Separator } from "@/components/ui/separator";
import { HERO_FIELD } from "@/lib/bloom-field";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** One orchestrated sunrise: light, then the field coming up, then her name. */
const SUN_DELAY = 0;
const FIELD_DELAY = 0.35;
const FIELD_STAGGER = 0.07;
const NAME_DELAY = 1;
const LINES_DELAY = 1.5;
const META_DELAY = 1.85;
const CUE_DELAY = 2.3;

const POLLEN_COUNT = 18;
const SUN_DRIFT_PX = 30;

type HeroSunProps = {
  name: string;
  fullName: string;
  openingLines: readonly string[];
  dateLabel: string;
  ageLabel: string;
  tilt: { x: number; y: number };
  animated: boolean;
  /** Decorative drift, held back until after hydration. */
  atmosphere: boolean;
};

export function HeroSun({
  name,
  fullName,
  openingLines,
  dateLabel,
  ageLabel,
  tilt,
  animated,
  atmosphere,
}: HeroSunProps) {
  const arrive = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE_OUT },
        }
      : {};

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-24 pb-[34svh]">
      <PollenField count={POLLEN_COUNT} animated={atmosphere} />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* The sun sits behind her name, not behind the sentences — a hard disc
            under body copy reads as a sticker rather than as light. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -z-10 aspect-square w-[min(68vw,21rem)] -translate-x-1/2 -translate-y-[36%]"
          style={{
            transform: `translate(calc(-50% + ${tilt.x * SUN_DRIFT_PX}px), calc(-36% + ${
              tilt.y * SUN_DRIFT_PX * 0.6
            }px))`,
            transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          initial={animated ? { opacity: 0, scale: 0.82 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: SUN_DELAY, ease: EASE_OUT }}
        >
          <SunHalo animated={animated} className="absolute inset-[-26%]" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-sun-core) 0%, color-mix(in srgb, var(--color-sun-core) 88%, transparent) 30%, color-mix(in srgb, var(--color-sun-core) 46%, transparent) 52%, color-mix(in srgb, var(--color-petal) 34%, transparent) 72%, transparent 86%)",
            }}
          />
        </motion.div>

        {/* The type scale lives on the h1 so the em-based descender padding
            resolves against the display size, not the inherited 16px. */}
        <h1 className="font-display overflow-hidden pb-[0.34em] -mb-[0.34em] text-[clamp(4rem,15vw,11rem)] leading-[0.86] font-normal tracking-[-0.02em] text-seed">
          <span className="sr-only">{fullName}</span>
          <motion.span
            aria-hidden="true"
            className="block"
            initial={animated ? { y: "150%" } : false}
            animate={{ y: "0%" }}
            transition={{ duration: 0.95, delay: NAME_DELAY, ease: EASE_OUT }}
          >
            {name}
          </motion.span>
        </h1>

        <motion.p
          className="mt-8 max-w-md text-lg leading-relaxed text-balance text-seed sm:text-xl"
          {...arrive(LINES_DELAY)}
        >
          {openingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.p>

        <motion.div
          className="mt-9 flex items-center justify-center gap-4 text-sm text-seed-soft"
          {...arrive(META_DELAY)}
        >
          <span>{dateLabel}</span>
          <Separator
            orientation="vertical"
            className="bg-seed/25 data-[orientation=vertical]:h-4"
          />
          <span>{ageLabel}</span>
        </motion.div>
      </div>

      {/* A horizon, not a crop field. It turns with the pointer — that is the
          whole idea of the page, and it only needs a few flowers to say it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36svh] min-h-[13rem]"
      >
        <SunflowerField
          blooms={HERO_FIELD}
          grown
          tilt={tilt}
          growStagger={FIELD_STAGGER}
          growDelay={FIELD_DELAY}
          animated={animated}
          className="h-full w-full"
        />
      </div>

      <motion.span
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-10 h-12 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-seed/35 to-transparent"
        initial={animated ? { scaleY: 0, opacity: 0 } : false}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: CUE_DELAY, ease: EASE_OUT }}
      />
    </section>
  );
}
