/**
 * One sunflower, described once.
 * The seed head is laid out on a Fermat spiral at the golden angle, which is
 * how a real sunflower packs its florets — worth the twenty lines of maths.
 */

export const SUNFLOWER_VIEWBOX = "-110 -110 220 220";

/** Petal shapes, drawn pointing straight up from the seed head. */
export const OUTER_PETAL_PATH =
  "M 0 -28 C 20 -50 22 -84 0 -104 C -22 -84 -20 -50 0 -28 Z";
export const INNER_PETAL_PATH =
  "M 0 -26 C 15 -44 17 -62 0 -76 C -17 -62 -15 -44 0 -26 Z";

const OUTER_PETAL_COUNT = 21;
const INNER_PETAL_COUNT = 13;
const FULL_TURN_DEGREES = 360;

function ring(count: number, offsetDegrees = 0): number[] {
  return Array.from(
    { length: count },
    (_, index) => (index * FULL_TURN_DEGREES) / count + offsetDegrees,
  );
}

/** Sunflowers favour Fibonacci numbers of ray florets. 21 and 13 are both real counts. */
export const OUTER_PETAL_ANGLES = ring(OUTER_PETAL_COUNT);
export const INNER_PETAL_ANGLES = ring(
  INNER_PETAL_COUNT,
  FULL_TURN_DEGREES / (INNER_PETAL_COUNT * 2),
);

export const SEED_HEAD_RADIUS = 30;

const GOLDEN_ANGLE_DEGREES = 137.507_764;
const SEED_COUNT = 150;
const SEED_SPACING = 2.3;
const SEED_DOT_MIN_RADIUS = 0.75;
const SEED_DOT_MAX_RADIUS = 1.7;

export type Point = { x: number; y: number };
export type Seed = Point & { radius: number };

/**
 * Node and the browser disagree on the last bit of Math.sin, which is enough to
 * fail hydration on an SVG coordinate. Four decimals is far finer than a
 * 220-unit viewBox can show, and it is identical everywhere.
 */
const COORDINATE_DECIMALS = 4;

function stable(value: number): number {
  return Number(value.toFixed(COORDINATE_DECIMALS));
}

/**
 * The packing a sunflower actually uses: each item turned one golden angle from
 * the last, at a radius that grows with the square root of its index. Used for
 * the seed head, and again for the candles.
 */
export function goldenSpiral(count: number, spacing: number): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index * GOLDEN_ANGLE_DEGREES * Math.PI) / 180;
    const distance = spacing * Math.sqrt(index);

    return {
      x: stable(distance * Math.cos(angle)),
      y: stable(distance * Math.sin(angle)),
    };
  });
}

export const SEEDS: Seed[] = goldenSpiral(SEED_COUNT, SEED_SPACING).map(
  (point, index) => ({
    ...point,
    radius: stable(
      SEED_DOT_MIN_RADIUS +
        ((SEED_DOT_MAX_RADIUS - SEED_DOT_MIN_RADIUS) * index) /
          (SEED_COUNT - 1),
    ),
  }),
);

/**
 * Deterministic pseudo-random in 0..1. Server and client agree, so nothing
 * hydrates twice — which rules out Math.random for anything rendered.
 */
export function scatterNoise(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43_758.545_3;
  return stable(value - Math.floor(value));
}
