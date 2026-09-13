"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { BecauseOfYou } from "@/components/because-of-you";
import { Closing } from "@/components/closing";
import { Envelope } from "@/components/envelope";
import { GalleryGrid } from "@/components/gallery-grid";
import { HeroSun } from "@/components/hero-sun";
import { Letter } from "@/components/letter";
import { Music } from "@/components/music";
import { NamesCarousel } from "@/components/names-carousel";
import { PhotoLightbox } from "@/components/photo-lightbox";
import { TurningSection } from "@/components/turning-section";
import { WishCandles } from "@/components/wish-candles";
import { usePointerOrigin } from "@/hooks/use-pointer-origin";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useWish } from "@/hooks/use-wish";
import {
  BECAUSE_OF_YOU,
  BIRTHDAY,
  CLOSING,
  ENVELOPE,
  GALLERY,
  GALLERY_SECTION,
  HERO,
  HERO_PORTRAITS,
  LETTER,
  MUSIC,
  NAME_CYCLE_MS,
  NAMES,
  TURNING,
  WISH,
  WISH_BLOW_OUT_MS,
} from "@/lib/constants";

export default function BirthdayPage() {
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  const [sealed, setSealed] = useState(true);
  const open = useCallback(() => setSealed(false), []);

  /* Nothing behind the envelope is reachable until it is open. */
  useEffect(() => {
    document.body.style.overflow = sealed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sealed]);

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
    <>
      <Envelope
        eyebrow={ENVELOPE.eyebrow}
        name={ENVELOPE.name}
        note={ENVELOPE.note}
        actionLabel={ENVELOPE.action}
        sealed={sealed}
        onOpen={open}
        animated={animated}
      />

      <Music
        src={MUSIC.src}
        volume={MUSIC.volume}
        playLabel={MUSIC.playLabel}
        pauseLabel={MUSIC.pauseLabel}
        unlocked={!sealed}
      />

      {/* The page is mounted from the start so the photographs are already in
          hand when the envelope parts — but keying it to the seal restarts
          every entrance, so her arrival is watched rather than missed. */}
      <main
        key={sealed ? "sealed" : "open"}
        className="flex flex-col"
        style={{
          background:
            /* One warm progression from top to bottom. The old tail cooled off
             into sky blue under the last two sections, which put an ice-cold
             ground directly beneath a room lit by candles — the single worst
             adjacency on the page. It now warms instead of cooling, and holds
             one constant cream from 84% down so the candles and the closing
             stand on the same colour. That constant is what lets the dark room
             begin and end on the exact tone of the page it interrupts. */
            "linear-gradient(to bottom, #fdfcf9 0%, #fdfcf9 8%, #fdf9ee 13%, #fff3cf 20%, #fdf8e6 27%, #fdfcf9 33%, #fdfcf9 46%, #fcf9f1 62%, #f9f4e7 74%, #f6efe1 84%, #f6efe1 100%)",
        }}
      >
        <HeroSun
          name={HERO.name}
          fullName={HERO.fullName}
          portraits={HERO_PORTRAITS}
          openingLines={HERO.openingLines}
          dateLabel={HERO.dateLabel}
          ageLabel={HERO.ageLabel}
          tilt={tilt}
          animated={animated}
        />

        <TurningSection
          heading={TURNING.heading}
          lead={TURNING.lead}
          detail={TURNING.detail}
          aside={TURNING.aside}
          setup={TURNING.setup}
          closing={TURNING.closing}
          tilt={tilt}
          animated={animated}
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
          coda={BECAUSE_OF_YOU.coda}
          animated={animated}
        />

        <GalleryGrid
          heading={GALLERY_SECTION.heading}
          intro={GALLERY_SECTION.intro}
          hint={GALLERY_SECTION.hint}
          outro={GALLERY_SECTION.outro}
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
          unfoldLabel={LETTER.unfold}
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
          date={CLOSING.date}
          signature={CLOSING.signature}
          onTheDay={CLOSING.onTheDay}
          untilNext={CLOSING.untilNext}
          birthday={BIRTHDAY}
          animated={animated}
        />

        <PhotoLightbox
          photo={openPhotoIndex === null ? null : GALLERY[openPhotoIndex]}
          onClose={closeLightbox}
        />
      </main>
    </>
  );
}
