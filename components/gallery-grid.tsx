"use client";

import Image from "next/image";
import { motion } from "motion/react";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** A hand-pinned photo wall, so every print sits at its own small angle. */
const PRINT_ANGLES = [-1.6, 1.1, -0.7, 1.7, -1.2, 0.8];
const SETTLE_STAGGER = 0.08;

type GalleryGridProps = {
  heading: string;
  intro: string;
  photos: readonly Photo[];
  onSelectPhoto: (index: number) => void;
  animated: boolean;
};

export function GalleryGrid({
  heading,
  intro,
  photos,
  onSelectPhoto,
  animated,
}: GalleryGridProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
      <header className="max-w-[46ch]">
        <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[0.98] font-normal tracking-[-0.015em] text-seed">
          {heading}
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-seed-soft">
          {intro}
        </p>
      </header>

      <div className="mt-14 gap-6 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => {
          const angle = PRINT_ANGLES[index % PRINT_ANGLES.length];

          return (
            <motion.button
              key={photo.src}
              type="button"
              onClick={() => onSelectPhoto(index)}
              className="mb-6 block w-full cursor-pointer break-inside-avoid rounded-[2px] bg-white p-2.5 pb-11 text-left shadow-[0_1px_2px_rgba(59,42,23,0.08),0_10px_28px_-14px_rgba(59,42,23,0.35)]"
              initial={
                animated
                  ? { opacity: 0, y: 34, rotate: angle * 2.5 }
                  : { rotate: angle }
              }
              whileInView={{ opacity: 1, y: 0, rotate: angle }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.75,
                delay: index * SETTLE_STAGGER,
                ease: EASE_OUT,
              }}
              whileHover={
                animated
                  ? {
                      rotate: 0,
                      y: -8,
                      scale: 1.015,
                      boxShadow:
                        "0 2px 4px rgba(59,42,23,0.1), 0 26px 48px -18px rgba(59,42,23,0.45)",
                    }
                  : undefined
              }
              whileFocus={animated ? { rotate: 0, y: -8 } : undefined}
              whileTap={animated ? { scale: 0.99 } : undefined}
            >
              <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="h-auto w-full"
              />
              <span className="mt-3.5 block px-1 text-[0.9375rem] leading-snug text-seed-soft">
                {photo.caption}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
