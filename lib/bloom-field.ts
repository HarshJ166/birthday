/**
 * Where every flower stands in a field, laid out once and shared by the hero
 * and the wish. Coordinates are in the field's own viewBox.
 *
 * The box is deliberately wide and short. It is drawn with "slice", so a box
 * closer to the container's own proportions keeps the far row from being
 * cropped away and leaving headless stems behind.
 */

import { scatterNoise } from "@/lib/sunflower-geometry";

export const FIELD_VIEWBOX_WIDTH = 1600;
export const FIELD_VIEWBOX_HEIGHT = 420;

/** Stems run past the bottom edge so the field never looks like it is floating. */
export const STEM_ROOT_Y = FIELD_VIEWBOX_HEIGHT + 90;

export type Bloom = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  /** 0 is far away and barely moves, 1 is up close and leads the parallax. */
  depth: number;
};

type RowSpec = {
  count: number;
  y: number;
  scaleMin: number;
  scaleMax: number;
  opacity: number;
  depth: number;
  /** Keeps each row's jitter from repeating the row above it. */
  seed: number;
  /** How much of a slot's width a flower may wander, 0 to 1. */
  jitter: number;
  /** How far a flower may stand above or below its row line. */
  rise: number;
  spanStart?: number;
  spanEnd?: number;
};

function row({
  count,
  y,
  scaleMin,
  scaleMax,
  opacity,
  depth,
  seed,
  jitter,
  rise,
  spanStart = 0,
  spanEnd = FIELD_VIEWBOX_WIDTH,
}: RowSpec): Bloom[] {
  const slot = (spanEnd - spanStart) / count;

  return Array.from({ length: count }, (_, index) => {
    const drift = (scatterNoise(seed + index) - 0.5) * slot * jitter;
    const height = scatterNoise(seed + index + 500);

    return {
      x: spanStart + slot * (index + 0.5) + drift,
      y: y + (scatterNoise(seed + index + 900) - 0.5) * rise,
      scale: scaleMin + height * (scaleMax - scaleMin),
      opacity,
      depth,
    };
  });
}

/** Three bands of depth. The far row is a haze, the near row is cropped by the edge. */
export const HERO_FIELD: Bloom[] = [
  ...row({ count: 14, y: 176, scaleMin: 0.1, scaleMax: 0.15, opacity: 0.4, depth: 0.18, seed: 11, jitter: 0.9, rise: 30 }),
  ...row({ count: 10, y: 262, scaleMin: 0.16, scaleMax: 0.23, opacity: 0.72, depth: 0.5, seed: 73, jitter: 0.85, rise: 36 }),
  ...row({ count: 7, y: 350, scaleMin: 0.28, scaleMax: 0.44, opacity: 1, depth: 1, seed: 137, jitter: 0.8, rise: 40 }),
];
