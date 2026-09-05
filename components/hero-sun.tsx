"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { Separator } from "@/components/ui/separator";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const PORTRAIT_DELAY = 0.15;
const NAME_DELAY = 0.5;
const RULE_DELAY = 1.05;
const LINES_DELAY = 1.2;
const META_DELAY = 1.45;

const ORBIT_SECONDS = 150;
const DRIFT_PX = 18;
/** A slow push on the photograph, so the frame is never quite still. */
const BREATH_SECONDS = 28;

type Portrait = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type HeroSunProps = {
  name: string;
  fullName: string;
  portrait: Portrait;
  openingLines: readonly string[];
  dateLabel: string;
  ageLabel: string;
  tilt: { x: number; y: number };
  animated: boolean;
};

export function HeroSun({
  name,
  fullName,
  portrait,
  openingLines,
  dateLabel,
  ageLabel,
  tilt,
  animated,
}: HeroSunProps) {
  const arrive = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE_OUT },
        }
      : {};

  return (
    <section className="relative lg:grid lg:min-h-[100svh] lg:grid-cols-[1fr_minmax(0,44%)]">
      {/* Her face first on a phone. Landing on a page of type is the one thing
          a hero must never do, so on small screens the photograph leads. */}
      <motion.div
        className="relative h-[62svh] min-h-[21rem] overflow-hidden lg:order-2 lg:h-auto lg:min-h-0"
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, delay: PORTRAIT_DELAY, ease: EASE_OUT }}
      >
        <motion.div
          className="absolute inset-0"
          initial={animated ? { scale: 1.14 } : false}
          animate={animated ? { scale: [1.06, 1.01, 1.06] } : { scale: 1 }}
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
          <Image
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt}
            sizes="(min-width: 1024px) 44vw, 100vw"
            priority
            className="h-full w-full object-cover object-[50%_16%] lg:object-top"
            style={{ filter: "saturate(1.08) contrast(1.04)" }}
          />
        </motion.div>

        {/* A little of the page's own light laid over the photograph, so it
            belongs to the palette instead of sitting on top of it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(200deg, color-mix(in srgb, var(--color-sun-core) 34%, transparent) 0%, transparent 46%)",
          }}
        />

        {/* Every edge where the photograph meets paper is dissolved rather than
            cut, so the hero has no seam to notice. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-paper via-paper/78 to-transparent lg:h-[38%] lg:via-paper/72"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-paper via-paper/55 to-transparent lg:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper/85 to-transparent"
        />
      </motion.div>

      <div className="relative -mt-[13svh] flex flex-col justify-center px-7 pb-20 sm:px-12 lg:order-1 lg:mt-0 lg:min-h-[100svh] lg:px-16 lg:pt-24 lg:pb-16 xl:px-24">
        {/* The sun on its path, rather than a glow behind the type. One thin
            orbit and one small disc reads as drawn; a soft blob reads as filler. */}
        <motion.svg
          aria-hidden="true"
          viewBox="-60 -60 120 120"
          className="pointer-events-none absolute top-[38%] -left-[26%] -z-10 aspect-square w-[min(96vw,34rem)] lg:top-1/2 lg:left-[6%]"
          style={{
            transform: `translate(${(tilt.x * DRIFT_PX).toFixed(1)}px, calc(-50% + ${(
              tilt.y * DRIFT_PX
            ).toFixed(1)}px))`,
            transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          initial={animated ? { opacity: 0, scale: 0.94 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        >
          <circle
            r="52"
            fill="none"
            stroke="var(--color-sun-deep)"
            strokeWidth="0.4"
            opacity="0.34"
          />
          <motion.g
            animate={animated ? { rotate: 360 } : undefined}
            transition={{
              duration: ORBIT_SECONDS,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle cy="-52" r="7.5" fill="var(--color-sun-core)" />
            <circle cy="-52" r="15" fill="var(--color-sun-core)" opacity="0.16" />
          </motion.g>
        </motion.svg>

        {/* The type scale lives on the h1 so the em-based descender padding
            resolves against the display size, not the inherited 16px. */}
        <h1 className="font-display overflow-hidden pb-[0.34em] -mb-[0.34em] text-[clamp(4rem,17vw,9rem)] leading-[0.84] font-normal tracking-[-0.025em] text-seed">
          <span className="sr-only">{fullName}</span>
          <motion.span
            aria-hidden="true"
            className="block"
            initial={animated ? { y: "150%" } : false}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: NAME_DELAY, ease: EASE_OUT }}
          >
            {name}
          </motion.span>
        </h1>

        <motion.span
          aria-hidden="true"
          className="mt-7 block h-px w-24 origin-left bg-sun-deep/60 lg:mt-8"
          initial={animated ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: RULE_DELAY, ease: EASE_OUT }}
        />

        <motion.p
          className="mt-6 max-w-[26ch] text-[1.1875rem] leading-relaxed text-seed sm:text-[1.3125rem] lg:mt-7"
          {...arrive(LINES_DELAY)}
        >
          {openingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.p>

        <motion.div
          className="mt-9 flex items-center gap-4 text-sm text-seed-soft lg:mt-12"
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
    </section>
  );
}
