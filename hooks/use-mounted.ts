"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * False during server render and the hydration pass, true afterwards.
 * Lets purely decorative motion stay out of the HTML entirely, which is the
 * only reliable way to keep floating-point styles from mismatching.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, onClient, onServer);
}
