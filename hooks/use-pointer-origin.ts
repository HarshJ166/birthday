"use client";

import { useEffect, useState } from "react";

export type PointerOrigin = { x: number; y: number };

const CENTRE: PointerOrigin = { x: 0, y: 0 };

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

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [enabled]);

  return enabled ? origin : CENTRE;
}
