"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { EASE_OUT, reveal } from "@/lib/motion";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

/** A hand-pinned photo wall, so every print sits at its own small angle. */
const PRINT_ANGLES = [-1.6, 1.1, -0.7, 1.7, -1.2, 0.8];
const SETTLE_STAGGER = 0.08;

/** Long enough to read as paper being turned in the hand rather than a card
    snapping over, and deep enough that the near edge genuinely comes at you. */
const TURN_SECONDS = 0.8;
const PERSPECTIVE_PX = 1400;

const PRINT_FACE =
  "rounded-[2px] bg-white p-2.5 shadow-[0_1px_2px_rgba(59,42,23,0.08),0_10px_28px_-14px_rgba(59,42,23,0.35)]";

/** The back of a print: the same stock, seen from the other side. */
const PRINT_BACK =
  "linear-gradient(152deg, #fffdf7 0%, #f7f1e4 52%, #efe7d6 100%)";

type GalleryGridProps = {
  heading: string;
  intro: string;
  hint: string;
  /** A line after the last print, about the two people behind them. */
  outro: string;
  photos: readonly Photo[];
  onSelectPhoto: (index: number) => void;
  animated: boolean;
};

export function GalleryGrid({
  heading,
  intro,
  hint,
  outro,
  photos,
  onSelectPhoto,
  animated,
}: GalleryGridProps) {
  /**
   * Which prints have been turned over. Nobody who has asked not to be
   * animated should have to tap eight times to see a photograph, so with motion
   * off they all start face up.
   */
  const [turned, setTurned] = useState<number[]>(() =>
    animated ? [] : photos.map((_, index) => index),
  );

  const turn = (index: number) =>
    setTurned((current) =>
      current.includes(index) ? current : [...current, index],
    );

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
      <motion.header className="max-w-[46ch]" {...reveal(animated)}>
        <h2 className="font-display text-head font-normal text-seed [--opsz:48]">
          {heading}
        </h2>
        <p className="mt-4 text-body text-seed-soft">{intro}</p>
        <p className="font-hand mt-3 text-hand text-ember-ink">{hint}</p>
      </motion.header>

      <div className="mt-14 gap-6 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => {
          const angle = PRINT_ANGLES[index % PRINT_ANGLES.length];
          const faceUp = turned.includes(index);

          return (
            <motion.div
              key={photo.src}
              className="mb-6 break-inside-avoid"
              style={{ perspective: PERSPECTIVE_PX }}
              initial={
                animated
                  ? { opacity: 0, y: 34, rotate: angle * 2.5 }
                  : { rotate: angle }
              }
              whileInView={{ opacity: 1, y: 0, rotate: angle }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{
                duration: 0.75,
                delay: index * SETTLE_STAGGER,
                ease: EASE_OUT,
              }}
              whileHover={
                animated ? { rotate: 0, y: -8, scale: 1.015 } : undefined
              }
            >
              <motion.div
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: faceUp ? 0 : 180 }}
                initial={false}
                transition={{ duration: TURN_SECONDS, ease: EASE_OUT }}
              >
                <button
                  type="button"
                  onClick={() => onSelectPhoto(index)}
                  tabIndex={faceUp ? 0 : -1}
                  aria-hidden={!faceUp}
                  className={`block w-full cursor-pointer pb-11 text-left ${PRINT_FACE}`}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    pointerEvents: faceUp ? "auto" : "none",
                  }}
                >
                  <Image
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt={photo.alt}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="h-auto w-full"
                  />
                  <span className="mt-3.5 block px-1 text-small text-seed-soft">
                    {photo.caption}
                  </span>
                </button>

                {/* The back sits over the face and takes its height from it, so
                    the wall never changes shape as prints are turned. */}
                <button
                  type="button"
                  onClick={() => turn(index)}
                  tabIndex={faceUp ? -1 : 0}
                  aria-hidden={faceUp}
                  aria-label={`Turn over print ${index + 1}`}
                  className={`absolute inset-0 flex cursor-pointer flex-col items-center justify-center ${PRINT_FACE}`}
                  style={{
                    background: PRINT_BACK,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    pointerEvents: faceUp ? "none" : "auto",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="block size-2.5 rounded-full bg-sun-core/70"
                  />
                  <span
                    aria-hidden="true"
                    className="font-hand mt-3 text-hand-lg text-seed-soft/70"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="font-hand mt-4 max-w-[46ch] text-hand text-ember-ink"
        {...reveal(animated)}
      >
        {outro}
      </motion.p>
    </section>
  );
}
