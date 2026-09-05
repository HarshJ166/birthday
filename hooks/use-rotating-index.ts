"use client";

import { useEffect, useState } from "react";

/**
 * Steps through 0..length-1 on a timer and wraps around.
 * Reports 0 while paused, so a still page still shows something sensible.
 */
export function useRotatingIndex(
  length: number,
  intervalMs: number,
  running: boolean,
): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running || length < 2) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % length),
      intervalMs,
    );

    return () => clearInterval(timer);
  }, [intervalMs, length, running]);

  return running ? index % length : 0;
}
