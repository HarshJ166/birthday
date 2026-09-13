"use client";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/motion";

/** The halves wait for the writing to go before they part. */
const WRITING_OUT = 0.3;
const PART_SECONDS = 1;
/** The flap is the first thing to move — it has to clear before anything
    behind it does. */
const FLAP_SECONDS = 0.7;
/** How long the card takes to fill the screen, and how long it waits for the
    flap and seal to be out of its way first. */
const GROW_SECONDS = 1.2;
const GROW_DELAY = WRITING_OUT + 0.15;
/** A downward-pointing triangle the width of the envelope, apex on the seam —
    the flap shape, folded closed. */
const FLAP_SHAPE = "polygon(0% 0%, 100% 0%, 50% 100%)";

type EnvelopeProps = {
  eyebrow: string;
  name: string;
  note: string;
  actionLabel: string;
  sealed: boolean;
  onOpen: () => void;
  animated: boolean;
};

/**
 * The page arrives sealed, and everything else waits behind it.
 *
 * It buys two things for one tap: an arrival moment, so the hero's whole
 * entrance is watched rather than missed, and the plain fact that a gift
 * should be opened rather than simply be there. The flap folds back in 3D,
 * the card that was inside it grows to fill the screen, and what it grows
 * into is the real page underneath.
 */
export function Envelope({
  eyebrow,
  name,
  note,
  actionLabel,
  sealed,
  onOpen,
  animated,
}: EnvelopeProps) {
  const half = (edge: "top" | "bottom") => ({
    className: `absolute inset-x-0 ${edge === "top" ? "top-0" : "bottom-0"} h-1/2 bg-paper`,
    exit: animated ? { y: edge === "top" ? "-100%" : "100%" } : { opacity: 0 },
    transition: {
      duration: PART_SECONDS,
      delay: WRITING_OUT,
      ease: EASE_OUT,
    },
  });

  return (
    <AnimatePresence>
      {sealed ? (
        <motion.div
          key="envelope"
          className="fixed inset-0 z-50"
          style={{ perspective: 1400 }}
          /* Nothing to animate in — it is the first thing on screen. */
          initial={false}
        >
          <motion.div aria-hidden="true" {...half("top")} />
          <motion.div aria-hidden="true" {...half("bottom")} />

          {/* The flap, folded down over the seam. It has a top and bottom
              face, so it still reads as paper past 90 degrees instead of
              vanishing — backfaceVisibility is deliberately left on. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              clipPath: FLAP_SHAPE,
              background:
                "linear-gradient(175deg, #fffdf7 0%, #f7f0df 78%, #ecdcb8 100%)",
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
            }}
            initial={false}
            exit={animated ? { rotateX: -165 } : { opacity: 0 }}
            transition={{ duration: FLAP_SECONDS, ease: EASE_OUT }}
          />

          {/* The seam, and the seal sitting on it. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
            exit={animated ? { opacity: 0, scale: 0.6 } : { opacity: 0 }}
            transition={{ duration: WRITING_OUT, ease: EASE_OUT }}
          >
            <span className="h-px flex-1 bg-sun-deep/25" />
            <motion.span
              className="mx-4 block size-3 rounded-full bg-sun-core"
              style={{
                boxShadow:
                  "0 0 2.5rem 0.5rem color-mix(in srgb, var(--color-sun-core) 45%, transparent)",
              }}
              animate={animated ? { scale: [1, 1.14, 1] } : undefined}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="h-px flex-1 bg-sun-deep/25" />
          </motion.div>

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {/* The card that was waiting inside the flap. On open it is the
                one thing that does not slide or fade away — it grows, and
                what it grows into is the real page underneath. */}
            <motion.div
              className="w-full max-w-[24rem] rounded-lg border border-sun-deep/15 bg-paper px-8 py-10 shadow-[0_2px_4px_rgba(59,42,23,0.06),0_30px_70px_-34px_rgba(59,42,23,0.4)]"
              exit={animated ? { scale: 9, opacity: 0 } : { opacity: 0 }}
              transition={{
                duration: GROW_SECONDS,
                delay: GROW_DELAY,
                ease: EASE_OUT,
              }}
            >
              <motion.p
                className="font-hand text-hand-lg text-ember-ink"
                initial={animated ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
              >
                {eyebrow}
              </motion.p>

              <motion.p
                className="font-display mt-2 text-head-lg font-normal text-bark [--opsz:48]"
                initial={animated ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT }}
              >
                {name}
              </motion.p>

              <motion.p
                className="mt-6 max-w-[30ch] text-small text-balance whitespace-pre-line text-seed-soft"
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT }}
              >
                {note}
              </motion.p>

              <motion.div
                initial={animated ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: EASE_OUT }}
              >
                <Button
                  size="lg"
                  onClick={onOpen}
                  autoFocus
                  className="mt-7 h-12 cursor-pointer rounded-full bg-sun-core px-10 text-base font-medium text-seed shadow-none hover:bg-sun-deep focus-visible:ring-sun-deep"
                >
                  {actionLabel}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
