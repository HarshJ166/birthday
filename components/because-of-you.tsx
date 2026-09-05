"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const WORD_STAGGER = 0.05;

/**
 * The words fade up rather than sliding out of a mask. Fraunces' italic
 * descenders vary enough between glyphs that no single clip height is safe.
 */
const HEADING_STATES = { hidden: {}, shown: {} } as const;
const WORD_STATES = {
  hidden: { opacity: 0, y: "0.32em" },
  shown: { opacity: 1, y: "0em" },
} as const;

type BecauseOfYouProps = {
  eyebrow: string;
  heading: string;
  paragraphs: readonly string[];
  animated: boolean;
};

export function BecauseOfYou({
  eyebrow,
  heading,
  paragraphs,
  animated,
}: BecauseOfYouProps) {
  const words = heading.split(" ");

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      {/* Light rather than a panel, so the section has no edge to notice. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 62% at 50% 50%, color-mix(in srgb, var(--color-petal) 46%, transparent) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <p className="text-[0.9375rem] text-seed-soft">{eyebrow}</p>

        <motion.h2
          className="font-display mt-6 text-[clamp(2rem,6.5vw,4.25rem)] leading-[1.12] font-normal tracking-[-0.015em] text-balance text-seed italic"
          variants={HEADING_STATES}
          initial={animated ? "hidden" : false}
          whileInView="shown"
          viewport={{ once: true, amount: 0.35 }}
        >
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <motion.span
                className="inline-block"
                variants={WORD_STATES}
                transition={{
                  duration: 0.7,
                  delay: index * WORD_STAGGER,
                  ease: EASE_OUT,
                }}
              >
                {word}
              </motion.span>
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </motion.h2>

        <div className="mx-auto mt-10 max-w-[48ch] space-y-5 text-[1.0625rem] leading-[1.7] text-balance text-seed-soft">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
