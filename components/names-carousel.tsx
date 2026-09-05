"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type NameEntry = { name: string; who: string };

type NamesCarouselProps = {
  heading: string;
  intro: string;
  entries: readonly NameEntry[];
  /** Which name currently holds the stage. */
  activeIndex: number;
  animated: boolean;
};

export function NamesCarousel({
  heading,
  intro,
  entries,
  activeIndex,
  animated,
}: NamesCarouselProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20 lg:py-28">
      <header className="max-w-[44ch]">
        <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[0.98] font-normal tracking-[-0.015em] text-seed">
          {heading}
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-seed-soft">
          {intro}
        </p>
      </header>

      <ul className="mt-14 space-y-1">
        {entries.map((entry, index) => {
          const isActive = animated && index === activeIndex;

          return (
            <li
              key={entry.name}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-x-3 py-3 sm:grid-cols-[1.75rem_minmax(0,auto)_minmax(0,1fr)] sm:gap-x-6"
            >
              <span className="relative flex h-[1.1em] w-full items-center justify-start">
                {isActive ? (
                  <motion.span
                    layoutId="name-marker"
                    className="block h-2.5 w-2.5 rounded-full bg-sun-core ring-4 ring-sun-core/25"
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  />
                ) : null}
              </span>

              <span
                className={cn(
                  "font-display text-[clamp(1.75rem,5vw,3rem)] leading-[1.1] font-normal transition-colors duration-500",
                  isActive ? "text-seed" : "text-seed/60",
                )}
              >
                {entry.name}
              </span>

              <span
                className="col-start-2 text-[0.9375rem] leading-snug text-seed-soft sm:col-start-3 sm:text-right"
              >
                {entry.who}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
