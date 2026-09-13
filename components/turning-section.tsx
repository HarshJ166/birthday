"use client";

import { motion } from "motion/react";

import { Sunflower } from "@/components/sunflower";
import { useDaylight } from "@/hooks/use-daylight";
import { EASE_OUT, reveal } from "@/lib/motion";

const MAX_TRACKING_DEGREES = 14;
/** Where a sunflower stands overnight: turned back to meet the sunrise. */
const EAST_DEGREES = -26;
const TRACKING_GLIDE = "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The section is named for one movement: the head starts turned away, seen
 * edge-on the way a sunflower is from the side of a field, and comes round to
 * face her as she arrives. It happens once. After that it only follows her.
 */
const TURNED_AWAY_DEGREES = -68;
const TURN_SECONDS = 1.8;
/** Close enough that the turn reads as depth rather than as a squash. */
const TURN_PERSPECTIVE_PX = 900;

type TurningSectionProps = {
  heading: string;
  /** The idea, in the serif: the flower's half, then hers. */
  lead: readonly string[];
  detail: string;
  /** His note in the margin, in the hand the letter is written in. */
  aside: string;
  /** The line the closing answers. */
  setup: string;
  /** The hero's line, coming back as the section's conclusion. */
  closing: readonly string[];
  /** Pointer position as -1 to 1. The flower turns to meet whoever is reading. */
  tilt: { x: number; y: number };
  animated: boolean;
};

export function TurningSection({
  heading,
  lead,
  detail,
  aside,
  setup,
  closing,
  tilt,
  animated,
}: TurningSectionProps) {
  const daylight = useDaylight();

  /* A sunflower turns back east overnight, to face the morning before the
     morning arrives. After dark this one stops answering the pointer and goes
     and does that. */
  const facing = daylight.night ? EAST_DEGREES : tilt.x * MAX_TRACKING_DEGREES;

  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 overflow-x-clip px-6 py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 lg:py-28">
      {/* On a phone the flower stands to one side and runs off the edge, so
          the words keep the full width and the flower is something in the room
          rather than a picture stacked on a paragraph. The reveal owns this
          box, the turn owns the next, and the tracking stays on a plain child,
          so no two of them ever write a transform to the same element. */}
      <motion.div
        className="-mr-20 ml-auto w-[min(62vw,16rem)] lg:mx-auto lg:w-[min(78vw,22rem)]"
        style={{ perspective: TURN_PERSPECTIVE_PX }}
        {...reveal(animated)}
      >
        <motion.div
          initial={animated ? { rotateY: TURNED_AWAY_DEGREES } : false}
          whileInView={{ rotateY: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: TURN_SECONDS, ease: EASE_OUT }}
        >
          <div
            style={{
              transform: `rotate(${facing}deg)`,
              transition: TRACKING_GLIDE,
            }}
          >
            <Sunflower
              tilt={tilt}
              openDelay={0}
              petalStagger={0}
              animated={false}
              className="h-full w-full"
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="text-pretty" {...reveal(animated, 0.12)}>
        <h2 className="font-display text-head font-normal text-seed [--opsz:48]">
          {heading}
        </h2>

        <p className="font-display mt-6 max-w-[30ch] text-lead-lg font-normal text-balance text-seed [--opsz:24]">
          {lead.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <p className="mt-6 max-w-[42ch] text-body text-seed-soft">{detail}</p>

        <p className="font-hand mt-5 max-w-[24ch] -rotate-1 pl-6 text-hand-lg text-ember-ink">
          {aside}
        </p>

        <p className="mt-8 max-w-[42ch] text-body text-seed-soft">{setup}</p>

        <p className="font-display mt-4 text-lead-lg font-normal text-seed italic [--opsz:24]">
          {closing.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </motion.div>
    </section>
  );
}
