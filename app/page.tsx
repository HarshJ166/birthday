"use client";

import { useCallback, useState } from "react";
import { useReducedMotion } from "motion/react";

import { BecauseOfYou } from "@/components/because-of-you";
import { Closing } from "@/components/closing";
import { GalleryGrid } from "@/components/gallery-grid";
import { HeroSun } from "@/components/hero-sun";
import { Letter } from "@/components/letter";
import { NamesCarousel } from "@/components/names-carousel";
import { PhotoLightbox } from "@/components/photo-lightbox";
import { TurningSection } from "@/components/turning-section";
import { WishCandles } from "@/components/wish-candles";
import { usePointerOrigin } from "@/hooks/use-pointer-origin";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useWish } from "@/hooks/use-wish";
import {
  BECAUSE_OF_YOU,
  CLOSING,
  GALLERY,
  GALLERY_SECTION,
  HERO,
  HERO_PORTRAIT,
  LETTER,
  NAME_CYCLE_MS,
  NAMES,
  TURNING,
  WISH,
  WISH_BLOW_OUT_MS,
} from "@/lib/constants";

export default function BirthdayPage() {
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  const tilt = usePointerOrigin(animated);
  const activeNameIndex = useRotatingIndex(
    NAMES.entries.length,
    NAME_CYCLE_MS,
    animated,
  );
  const { stage, advanceWish } = useWish(WISH_BLOW_OUT_MS);

  /** Blowing borrows the lit copy; the button is disabled while it happens. */
  const wishCopy = WISH.stages[stage === "blowing" ? "lit" : stage];

  const [openPhotoIndex, setOpenPhotoIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setOpenPhotoIndex(null), []);

  return (
    <main
      className="flex flex-col"
      style={{
        background:
          "linear-gradient(to bottom, #fdfcf9 0%, #fdfcf9 12%, #fdf9ee 20%, #fff3cf 30%, #fdf8e6 42%, #fdfcf9 56%, #fbfaf6 70%, #f6f9fb 84%, #e8f1f7 93%, #d8e8f1 100%)",
      }}
    >
      <HeroSun
        name={HERO.name}
        fullName={HERO.fullName}
        portrait={HERO_PORTRAIT}
        openingLines={HERO.openingLines}
        dateLabel={HERO.dateLabel}
        ageLabel={HERO.ageLabel}
        tilt={tilt}
        animated={animated}
      />

      <TurningSection
        heading={TURNING.heading}
        paragraphs={TURNING.paragraphs}
        aside={TURNING.aside}
        tilt={tilt}
      />

      <NamesCarousel
        heading={NAMES.heading}
        intro={NAMES.intro}
        entries={NAMES.entries}
        activeIndex={activeNameIndex}
        animated={animated}
      />

      <BecauseOfYou
        eyebrow={BECAUSE_OF_YOU.eyebrow}
        heading={BECAUSE_OF_YOU.heading}
        paragraphs={BECAUSE_OF_YOU.paragraphs}
        animated={animated}
      />

      <GalleryGrid
        heading={GALLERY_SECTION.heading}
        intro={GALLERY_SECTION.intro}
        photos={GALLERY}
        onSelectPhoto={setOpenPhotoIndex}
        animated={animated}
      />

      <Letter
        date={LETTER.date}
        salutation={LETTER.salutation}
        paragraphs={LETTER.paragraphs}
        closing={LETTER.closing}
        farewell={LETTER.farewell}
        signature={LETTER.signature}
        animated={animated}
      />

      <WishCandles
        heading={WISH.heading}
        note={wishCopy.note}
        actionLabel={wishCopy.action}
        granted={WISH.granted}
        stage={stage}
        onAdvance={advanceWish}
        animated={animated}
      />

      <Closing
        greeting={CLOSING.greeting}
        nudge={CLOSING.nudge}
        date={CLOSING.date}
        signature={CLOSING.signature}
        animated={animated}
      />

      <PhotoLightbox
        photo={openPhotoIndex === null ? null : GALLERY[openPhotoIndex]}
        onClose={closeLightbox}
      />
    </main>
  );
}
