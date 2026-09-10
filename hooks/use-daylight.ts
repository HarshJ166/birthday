"use client";

import { useSyncExternalStore } from "react";

import { DAYLIGHT, phaseAt, type Daylight, type PhaseKey } from "@/lib/daylight";

/** Re-read on the minute, so a page left open crosses into dusk on its own. */
const MINUTE = 60_000;

/**
 * Five of the six skies are unreachable at any given moment, which makes them
 * impossible to review and impossible to sign off. `?sky=night` stands in for
 * the clock so every phase can be looked at in daylight, so to speak.
 */
function forcedPhase(): Daylight | null {
  const key = new URLSearchParams(window.location.search).get("sky");
  return key && key in DAYLIGHT ? DAYLIGHT[key as PhaseKey] : null;
}

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, MINUTE);
  return () => clearInterval(timer);
}

/**
 * Which sky is up.
 *
 * `phaseAt` hands back one of six frozen phases, so the snapshot is reference-
 * stable and the minute tick only costs a render when the sky actually turns.
 *
 * The server has no idea what time it is where she is, so it always says golden
 * hour and the true phase lands on hydration — comfortably inside the two
 * seconds the hero spends fading up.
 */
export function useDaylight(): Daylight {
  return useSyncExternalStore(
    subscribe,
    () => forcedPhase() ?? phaseAt(new Date()),
    () => DAYLIGHT.golden,
  );
}
