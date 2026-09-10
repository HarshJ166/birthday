"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type MusicProps = {
  src: string;
  volume: number;
  playLabel: string;
  pauseLabel: string;
  /**
   * The envelope's tap. No browser will start audio without a gesture behind
   * it, so the seal is doing double duty — it is already the gesture that buys
   * the tilt sensor.
   */
  unlocked: boolean;
};

export function Music({
  src,
  volume,
  playLabel,
  pauseLabel,
  unlocked,
}: MusicProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audio.current;
    if (!el || !unlocked) return;

    el.volume = volume;
    /* A refusal is not a failure. It leaves the control showing "play", which
       is the entire reason the control exists. */
    void el.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [unlocked, volume]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;

    if (el.paused) {
      void el.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      {/* Fetched behind the envelope, so it is ready the moment one parts. */}
      <audio ref={audio} src={src} loop preload="auto" />
      {unlocked ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? pauseLabel : playLabel}
          aria-pressed={playing}
          /* Bottom right, where every sky has already eased to paper. */
          className="fixed right-5 bottom-5 z-40 flex size-11 cursor-pointer items-center justify-center rounded-full border border-hairline bg-paper/80 text-seed-soft backdrop-blur-sm transition-colors duration-300 hover:text-seed focus-visible:ring-2 focus-visible:ring-sun-deep focus-visible:outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:delay-1000 motion-safe:duration-700 motion-safe:fill-mode-both"
        >
          {playing ? (
            <Volume2 aria-hidden="true" className="size-[1.15rem]" />
          ) : (
            <VolumeX aria-hidden="true" className="size-[1.15rem]" />
          )}
        </button>
      ) : null}
    </>
  );
}
