/** The page's one easing curve: quick away, long settle. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * The scroll reveal every section shares, so the page arrives in one voice
 * instead of eight.
 *
 * It fires off the element's top edge rather than a fraction of its area: a
 * block taller than a phone screen can never show 30% of itself, and a reveal
 * keyed to that would leave the content invisible forever.
 */
export function reveal(animated: boolean, delay = 0) {
  return animated
    ? {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "0px 0px -12% 0px" },
        transition: { duration: 0.8, delay, ease: EASE_OUT },
      }
    : {};
}
