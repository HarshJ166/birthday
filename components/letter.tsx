"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { EASE_OUT } from "@/lib/motion";

/**
 * The ruling pitch. Every line-height and vertical gap inside the letter is
 * this value or a multiple of it — that is the only way the text lands on the
 * lines instead of drifting off them a few paragraphs down.
 */
const RULE = "1.75rem";

const RULE_INK = "rgba(126, 166, 196, 0.45)";
const MARGIN_INK = "rgba(206, 122, 122, 0.38)";

/**
 * How much of the sheet shows while it is still folded — the date, the
 * salutation, and enough of the first line to prove there is something here
 * worth opening. Whole multiples of the ruling, so the crease lands on a line
 * rather than through the middle of one.
 */
const FOLDED = `calc(${RULE} * 7)`;

/** The crease. A pale highlight over a soft shadow is what a fold in paper
    actually looks like from directly above. */
const CREASE =
  "linear-gradient(to bottom, rgba(59,42,23,0.09) 0%, rgba(255,255,255,0.85) 45%, rgba(59,42,23,0.05) 100%)";

/**
 * background-origin: content-box starts the ruling at the first line of text
 * rather than at the padding edge; border-box clip still paints it edge to edge.
 */
const RULED_PAPER = {
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${RULE} - 1px), ${RULE_INK} calc(${RULE} - 1px), ${RULE_INK} ${RULE})`,
  backgroundOrigin: "content-box",
  backgroundClip: "border-box",
} as const;

type LetterProps = {
  date: string;
  salutation: string;
  paragraphs: readonly string[];
  closing: string;
  farewell: string;
  signature: string;
  unfoldLabel: string;
  animated: boolean;
};

export function Letter({
  date,
  salutation,
  paragraphs,
  closing,
  farewell,
  signature,
  unfoldLabel,
  animated,
}: LetterProps) {
  const [folded, setFolded] = useState(true);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 lg:py-28">
      <motion.article
        className="relative overflow-hidden rounded-[3px] bg-[#fffdf6] shadow-[0_1px_2px_rgba(59,42,23,0.06),0_30px_70px_-44px_rgba(59,42,23,0.5)]"
        initial={animated ? { opacity: 0, y: 28, rotate: -0.7 } : false}
        whileInView={{ opacity: 1, y: 0, rotate: -0.4 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        {/* The sheet opens out rather than the page cutting to it. */}
        <motion.div
          animate={{ height: folded ? FOLDED : "auto" }}
          initial={false}
          transition={{ duration: 1.1, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          {/* The margin rule runs the height of the sheet, over the ruling. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-9 z-10 w-px sm:left-14"
            style={{ background: MARGIN_INK }}
          />

          <div
            className="px-7 pt-10 pb-12 pl-14 sm:px-16 sm:pt-12 sm:pb-14 sm:pl-20"
            style={RULED_PAPER}
          >
            <p
              className="font-hand text-right text-[1.15rem] text-seed-soft"
              style={{ lineHeight: RULE }}
            >
              {date}
            </p>

            <p
              className="font-hand text-[1.7rem] text-seed"
              style={{ lineHeight: RULE, marginTop: RULE }}
            >
              {salutation}
            </p>

            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="font-hand text-[1.35rem] text-seed-soft"
                style={{ lineHeight: RULE, marginTop: RULE }}
              >
                {paragraph}
              </p>
            ))}

            <p
              className="font-hand text-[1.35rem] text-seed"
              style={{ lineHeight: RULE, marginTop: RULE }}
            >
              {closing}
            </p>

            <p
              className="font-hand text-[1.7rem] text-seed"
              style={{ lineHeight: RULE, marginTop: RULE }}
            >
              {farewell}
            </p>

            {/* Signed across two rulings, the way a real hand runs over them. */}
            <p
              className="font-hand text-[2.6rem] text-seed"
              style={{ lineHeight: `calc(${RULE} * 2)` }}
            >
              {signature}
            </p>
          </div>
        </motion.div>

        {folded ? (
          <button
            type="button"
            onClick={() => setFolded(false)}
            aria-expanded={false}
            className="absolute inset-x-0 bottom-0 z-20 flex cursor-pointer flex-col items-center justify-end pb-7"
            style={{ height: `calc(${RULE} * 4)` }}
          >
            {/* The rest of the sheet goes under the fold. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -top-8"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, #fffdf6 62%, #fffdf6 100%)",
              }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-8 h-[3px]"
              style={{ background: CREASE }}
            />
            <span className="font-hand relative rounded-full bg-sun-core px-6 py-1.5 text-[1.15rem] text-seed">
              {unfoldLabel}
            </span>
          </button>
        ) : null}
      </motion.article>
    </section>
  );
}
