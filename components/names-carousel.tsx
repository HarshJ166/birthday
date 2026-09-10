"use client";

import { motion } from "motion/react";

import { EASE_OUT, reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
      <motion.header className="max-w-[46ch]" {...reveal(animated)}>
        <h2 className="font-display text-head font-normal text-seed [--opsz:48]">
          {heading}
        </h2>
        <p className="mt-4 text-body text-seed-soft">{intro}</p>
      </motion.header>

      <ul className="mt-14 space-y-1">
        {entries.map((entry, index) => {
          const isActive = animated && index === activeIndex;

          return (
            <motion.li
              key={entry.name}
              {...reveal(animated, index * 0.07)}
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
                  "font-display text-name font-normal transition-colors duration-500 [--opsz:36]",
                  isActive ? "text-seed" : "text-seed/60",
                )}
              >
                {entry.name}
              </span>

              <span className="col-start-2 text-small text-seed-soft sm:col-start-3 sm:text-right">
                {entry.who}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
