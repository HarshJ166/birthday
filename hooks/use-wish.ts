"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WishStage = "unlit" | "lit" | "blowing" | "granted";

/** The button does one thing at a time, so the whole ritual is one handler. */
const NEXT_STAGE: Record<WishStage, WishStage> = {
  unlit: "lit",
  lit: "blowing",
  blowing: "blowing",
  granted: "unlit",
};

/**
 * Light them, blow them out, wish. `blowOutMs` is how long the breath takes to
 * cross the candles before the wish lands.
 */
export function useWish(blowOutMs: number) {
  const [stage, setStage] = useState<WishStage>("unlit");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const advanceWish = useCallback(() => {
    if (stage === "blowing") return;

    const next = NEXT_STAGE[stage];
    setStage(next);
    clearTimer();

    if (next === "blowing") {
      timer.current = setTimeout(() => setStage("granted"), blowOutMs);
    }
  }, [blowOutMs, clearTimer, stage]);

  return { stage, advanceWish };
}
