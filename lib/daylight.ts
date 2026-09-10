/**
 * The hero runs on the real clock.
 *
 * A sunflower tracks the sun all day and turns back east overnight to meet the
 * morning before it arrives. `TURNING` says exactly that in words, so the page
 * had better do it rather than describe it — open this at dawn and you get
 * dawn; open it at midnight and the sky is dark and the flower is already
 * facing the wrong way, waiting.
 *
 * Every sky below keeps the same structure: all the colour and drama live in
 * the top half, easing to paper by the foot. The name and the opening lines sit
 * on that paper in every phase, so type never has to change colour with the
 * hour — which is what keeps this a palette swap instead of a second design.
 */

const mix = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

/** The last of the light on the water, and the counter-glow in the far corner. */
const wash = (low: string, high: string) =>
  [
    `radial-gradient(120% 40% at 50% 92%, ${low}, transparent 62%)`,
    `radial-gradient(70% 52% at 4% -6%, ${high}, transparent 58%)`,
  ].join(",");

const bloom = (core: string, mid: string, edge: string) =>
  `radial-gradient(circle, ${core} 0%, ${mid} 24%, ${edge} 48%, transparent 70%)`;

/** The hour's own light, laid over the photograph in soft-light. */
const tint = (key: string, fill: string) =>
  `linear-gradient(210deg, ${key} 0%, transparent 44%, ${fill} 100%)`;

export type PhaseKey = "dawn" | "morning" | "midday" | "golden" | "dusk" | "night";

export type Daylight = {
  key: PhaseKey;
  sky: string;
  horizon: string;
  bloom: string;
  /** The disc. Its halation is mixed from this, so there is one colour to set. */
  disc: string;
  /**
   * The photograph was taken at one fixed hour, so it has to be re-lit to
   * belong to whatever hour it is being looked at. The tint is the key light
   * and the fill; the filter is the exposure the whole frame was shot at.
   */
  photoTint: string;
  photoFilter: string;
  /**
   * Soft-light lays a colour over the midtones and leaves highlights alone,
   * which is right for every lit hour and useless after dark: the brightest
   * part of this photograph is its own sunset sky, and soft-light cannot touch
   * it. Night multiplies instead, which is how day-for-night has always been
   * done — crush the highlights rather than tinting around them.
   */
  photoBlend: "soft-light" | "multiply";
  /**
   * Where the disc stands, as percentages. A phone frames the hero completely
   * differently from a desktop, so each carries its own pair: on a phone the
   * sun keeps to the band above the arch and crosses left to right through the
   * day; on a desktop it climbs and falls in its own pocket beside her.
   */
  top: string;
  left: string;
  lgTop: string;
  lgLeft: string;
  /** Stars out, halo down, and the flower turned east to wait. */
  night: boolean;
};

export const DAYLIGHT: Record<PhaseKey, Daylight> = {
  dawn: {
    key: "dawn",
    sky: "linear-gradient(176deg, #c9c0dd 0%, #edd7dd 22%, #ffe2c9 44%, #fdf0e0 70%, var(--color-paper) 100%)",
    horizon: wash(mix("var(--color-ember)", 10), mix("var(--color-dusk)", 34)),
    bloom: bloom(mix("#fff1d6", 50), mix("var(--color-petal)", 28), mix("var(--color-dusk)", 16)),
    disc: "#ffe6bd",
    photoTint: tint(mix("#ffd9b8", 34), mix("var(--color-dusk)", 32)),
    photoFilter: "saturate(0.94) contrast(1.02) brightness(0.98)",
    photoBlend: "soft-light",
    top: "11%",
    left: "16%",
    lgTop: "44%",
    lgLeft: "17%",
    night: false,
  },
  morning: {
    key: "morning",
    sky: "linear-gradient(176deg, #bcd7ec 0%, #dcebf5 22%, #f6f2e4 46%, #fdf8ee 72%, var(--color-paper) 100%)",
    horizon: wash(mix("var(--color-sun-core)", 10), mix("var(--color-sky)", 40)),
    bloom: bloom(mix("#fffdf0", 58), mix("var(--color-petal)", 26), mix("var(--color-sky)", 14)),
    disc: "#fff4cf",
    photoTint: tint(mix("#fffbe8", 32), mix("var(--color-sky)", 30)),
    photoFilter: "saturate(1.02) contrast(1.05) brightness(1.03)",
    photoBlend: "soft-light",
    top: "8%",
    left: "31%",
    lgTop: "25%",
    lgLeft: "33%",
    night: false,
  },
  midday: {
    key: "midday",
    sky: "linear-gradient(176deg, #a9cfeb 0%, #d3e7f4 22%, #f3f4ea 46%, #fcf9f0 72%, var(--color-paper) 100%)",
    horizon: wash(mix("var(--color-sun-core)", 8), mix("var(--color-sky)", 46)),
    bloom: bloom(mix("#ffffff", 62), mix("#fff6d2", 30), mix("var(--color-sun-core)", 10)),
    disc: "#fffdf2",
    photoTint: tint(mix("#ffffff", 36), mix("var(--color-sky)", 24)),
    photoFilter: "saturate(1.06) contrast(1.1) brightness(1.06)",
    photoBlend: "soft-light",
    top: "6%",
    left: "50%",
    lgTop: "9%",
    lgLeft: "49%",
    night: false,
  },
  /* Golden hour: the palette the page was designed in, kept verbatim. */
  golden: {
    key: "golden",
    sky: "linear-gradient(176deg, #ece7f2 0%, #fbf3e6 24%, #fff4d6 46%, #fdf6e8 72%, var(--color-paper) 100%)",
    horizon: wash(mix("var(--color-ember)", 15), mix("var(--color-dusk)", 22)),
    bloom: bloom(
      mix("var(--color-sun-core)", 62),
      mix("var(--color-amber)", 34),
      mix("var(--color-ember)", 12),
    ),
    disc: "var(--color-sun-core)",
    photoTint: tint(mix("var(--color-sun-core)", 40), mix("var(--color-dusk)", 26)),
    photoFilter: "saturate(1.1) contrast(1.04)",
    photoBlend: "soft-light",
    top: "9%",
    left: "82%",
    lgTop: "17%",
    lgLeft: "63%",
    night: false,
  },
  dusk: {
    key: "dusk",
    sky: "linear-gradient(176deg, #574370 0%, #b0708a 20%, #f0cbb2 42%, #fbebda 70%, var(--color-paper) 100%)",
    horizon: wash(mix("var(--color-ember)", 26), mix("var(--color-dusk)", 44)),
    bloom: bloom(
      mix("#ffd9a0", 56),
      mix("var(--color-ember)", 38),
      mix("var(--color-dusk)", 20),
    ),
    disc: "#ffcf8a",
    photoTint: tint(mix("var(--color-ember)", 38), mix("#4b3a68", 34)),
    photoFilter: "saturate(1.08) contrast(1.06) brightness(0.95)",
    photoBlend: "soft-light",
    top: "13%",
    left: "88%",
    lgTop: "40%",
    lgLeft: "77%",
    night: false,
  },
  /* The dark is kept to the top third. She still reads on paper. */
  night: {
    key: "night",
    sky: "linear-gradient(176deg, #10162a 0%, #29344f 18%, #8e8aa0 38%, #ddd6d5 62%, var(--color-paper) 100%)",
    horizon: wash(mix("var(--color-dusk)", 18), mix("#2b3a63", 52)),
    bloom: bloom(mix("#dfe6f5", 26), mix("#9aa8c8", 16), mix("#2b3a63", 10)),
    disc: "#eef1f8",
    photoTint: tint(mix("#7d9ad6", 30), mix("#16224a", 34)),
    photoFilter: "saturate(0.92) contrast(1.04) brightness(0.94)",
    photoBlend: "soft-light",
    top: "8%",
    left: "17%",
    lgTop: "19%",
    lgLeft: "21%",
    night: true,
  },
};

/**
 * Which sky is up. Boundaries are deliberately blunt — an hour either side of a
 * real sunrise is still recognisably dawn, and nobody opening a birthday page
 * wants it asking for their coordinates.
 */
export function phaseAt(date: Date): Daylight {
  const hour = date.getHours();

  if (hour < 5) return DAYLIGHT.night;
  if (hour < 7) return DAYLIGHT.dawn;
  if (hour < 11) return DAYLIGHT.morning;
  if (hour < 16) return DAYLIGHT.midday;
  if (hour < 19) return DAYLIGHT.golden;
  if (hour < 21) return DAYLIGHT.dusk;
  return DAYLIGHT.night;
}

/** The scatter a bright disc throws into the air immediately around it. */
export function halation(disc: string, spread = 50) {
  return `0 0 5rem 1.5rem ${mix(disc, spread)}`;
}

/**
 * The pool of light an arch stands in.
 *
 * An arch is a form that carries weight, so deleting its feet and fading it to
 * nothing leaves it hanging. This is the ground it lands on — mixed from the
 * hour's own disc, so at noon it is a hot white pool and after dark it is a
 * cold one.
 */
export function groundGlow(disc: string) {
  return `radial-gradient(ellipse 62% 100% at 50% 100%, ${mix(disc, 32)} 0%, ${mix(disc, 12)} 42%, transparent 72%)`;
}
