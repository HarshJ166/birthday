"use client";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { requestTiltAccess } from "@/hooks/use-pointer-origin";
import { EASE_OUT } from "@/lib/motion";

/** The halves wait for the writing to go before they part. */
const WRITING_OUT = 0.3;
const PART_SECONDS = 1;

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
 * It buys three things for one tap: an arrival moment, so the hero's whole
 * entrance is watched rather than missed; the user gesture iOS requires before
 * it will hand over the tilt sensor; and the plain fact that a gift should be
 * opened rather than simply be there.
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
  const open = () => {
    /* Asked here because this is the gesture — the answer is not awaited, so a
       slow permission sheet never holds the envelope shut. */
    void requestTiltAccess();
    onOpen();
  };

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
          /* Nothing to animate in — it is the first thing on screen. */
          initial={false}
        >
          <motion.div aria-hidden="true" {...half("top")} />
          <motion.div aria-hidden="true" {...half("bottom")} />

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

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
            exit={{ opacity: 0 }}
            transition={{ duration: WRITING_OUT, ease: EASE_OUT }}
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
              className="font-display mt-2 text-title font-normal text-bark [--opsz:96]"
              initial={animated ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT }}
            >
              {name}
            </motion.p>

            {/* Clear of the seam, so the writing never sits on the split. */}
            <motion.p
              className="mt-[18svh] max-w-[26ch] text-small text-seed-soft"
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
                onClick={open}
                autoFocus
                className="mt-7 h-12 cursor-pointer rounded-full bg-sun-core px-10 text-base font-medium text-seed shadow-none hover:bg-sun-deep focus-visible:ring-sun-deep"
              >
                {actionLabel}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
