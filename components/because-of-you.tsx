"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

import { EASE_OUT, reveal } from "@/lib/motion";

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
        <motion.p className="text-small text-seed-soft" {...reveal(animated)}>
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display mt-6 text-head-lg font-normal text-balance text-seed italic [--opsz:60]"
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

        <motion.div
          className="mx-auto mt-10 max-w-[46ch] space-y-5 text-body text-balance text-seed-soft"
          {...reveal(animated, 0.15)}
        >
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
