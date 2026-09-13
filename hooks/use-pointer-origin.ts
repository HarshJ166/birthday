"use client";

import { useEffect, useState } from "react";

export type PointerOrigin = { x: number; y: number };

const CENTRE: PointerOrigin = { x: 0, y: 0 };

/** Degrees of tilt that count as all the way over. A wrist, not a shoulder. */
const TILT_RANGE_DEGREES = 30;
/** Where a phone sits when someone is actually reading it, rather than flat. */
const TILT_REST_DEGREES = 40;
/**
 * Orientation events keep firing at screen rate whether the phone has moved or
 * not, so anything under this is dropped rather than re-rendering the hero
 * sixty times a second to say nothing.
 */
const TILT_DEADBAND = 0.012;

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/**
 * Where the light is being asked to go, as -1 to 1 on each axis.
 *
 * A desktop points at it. A phone leans toward it — which is the better version
 * of the idea, since tilting an object toward the light is the thing the whole
 * page is about.
 *
 * iOS gates `deviceorientation` behind a permission prompt that only a direct
 * `requestPermission()` call inside a tap can raise — asking for it on the
 * envelope's own tap felt like a bait and switch, so it is simply never asked
 * for. Android needs no such permission, so tilt still works there; iOS keeps
 * the pointer version only.
 */
export function usePointerOrigin(enabled: boolean): PointerOrigin {
  const [origin, setOrigin] = useState<PointerOrigin>(CENTRE);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOrigin({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: (event.clientY / window.innerHeight) * 2 - 1,
        });
      });
    };

    const handleTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;

      const next = {
        x: clamp(event.gamma / TILT_RANGE_DEGREES),
        y: clamp((event.beta - TILT_REST_DEGREES) / TILT_RANGE_DEGREES),
      };

      setOrigin((current) =>
        Math.abs(current.x - next.x) < TILT_DEADBAND &&
        Math.abs(current.y - next.y) < TILT_DEADBAND
          ? current
          : next,
      );
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("deviceorientation", handleTilt, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("deviceorientation", handleTilt);
    };
  }, [enabled]);

  return enabled ? origin : CENTRE;
}
