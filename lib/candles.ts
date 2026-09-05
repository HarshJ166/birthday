/**
 * Twenty-three candles standing on the seed head, one for each year.
 * They sit on the same golden-angle spiral the flower uses for its seeds, then
 * the whole arrangement is squashed vertically so the disc reads as a plate
 * seen from a low angle rather than a flat circle.
 */

import { goldenSpiral } from "@/lib/sunflower-geometry";

export const CANDLE_COUNT = 23;

const SPIRAL_SPACING = 13.4;
/** How far the disc is tipped away from the viewer. 1 would be face-on. */
const PERSPECTIVE_SQUASH = 0.44;
const BASE_HEIGHT = 26;
const HEIGHT_BY_DEPTH = 11;
const BASE_WIDTH = 5.2;
const WIDTH_BY_DEPTH = 1.9;

export type Candle = {
  /** Stable identity, kept through the depth sort so React keys never shuffle. */
  id: number;
  x: number;
  y: number;
  /** 0 at the back of the disc, 1 at the front. */
  depth: number;
  height: number;
  width: number;
  /** 0 on the left of the arrangement, 1 on the right — the order a breath sweeps. */
  sweep: number;
};

const spiral = goldenSpiral(CANDLE_COUNT, SPIRAL_SPACING);
const projected = spiral.map((point) => ({
  x: point.x,
  y: point.y * PERSPECTIVE_SQUASH,
}));

const minY = Math.min(...projected.map((p) => p.y));
const maxY = Math.max(...projected.map((p) => p.y));
const minX = Math.min(...projected.map((p) => p.x));
const maxX = Math.max(...projected.map((p) => p.x));

/** Back to front, so the painter's order is simply the array order. */
export const CANDLES: Candle[] = projected
  .map((point, id) => {
    const depth = (point.y - minY) / (maxY - minY);

    return {
      id,
      x: point.x,
      y: point.y,
      depth,
      height: BASE_HEIGHT + depth * HEIGHT_BY_DEPTH,
      width: BASE_WIDTH + depth * WIDTH_BY_DEPTH,
      sweep: (point.x - minX) / (maxX - minX),
    };
  })
  .sort((a, b) => a.y - b.y);

export const SEED_PLATE_RADIUS_X = 78;
export const SEED_PLATE_RADIUS_Y = SEED_PLATE_RADIUS_X * PERSPECTIVE_SQUASH;
export const PETAL_SQUASH = PERSPECTIVE_SQUASH;
