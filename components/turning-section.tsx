"use client";

import { Sunflower } from "@/components/sunflower";

const MAX_TRACKING_DEGREES = 14;

type TurningSectionProps = {
  heading: string;
  paragraphs: readonly string[];
  aside: string;
  /** Pointer position as -1 to 1. The flower turns to meet whoever is reading. */
  tilt: { x: number; y: number };
};

export function TurningSection({
  heading,
  paragraphs,
  aside,
  tilt,
}: TurningSectionProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 lg:py-28">
      <div
        className="mx-auto w-[min(78vw,22rem)]"
        style={{
          transform: `rotate(${tilt.x * MAX_TRACKING_DEGREES}deg)`,
          transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
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

      <div>
        <h2 className="font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.95] font-normal tracking-[-0.015em] text-seed">
          {heading}
        </h2>

        <div className="mt-7 space-y-5 text-[1.0625rem] leading-[1.7] text-seed-soft">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-[44ch]">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-10 max-w-[46ch] border-l-2 border-stem/40 pl-5 text-[0.9375rem] leading-relaxed text-stem italic">
          {aside}
        </p>

      </div>
    </section>
  );
}
