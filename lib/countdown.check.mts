/* Run with: node lib/countdown.check.mts */
import assert from "node:assert/strict";

import { daysUntil } from "./countdown.ts";

const on = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12, 0, 0);

/* The day itself reads nought, not a year. */
assert.equal(daysUntil(9, 13, on(2026, 9, 13)), 0);
assert.equal(daysUntil(9, 13, on(2026, 9, 12)), 1);
/* The day after rolls to next year. */
assert.equal(daysUntil(9, 13, on(2026, 9, 14)), 364);
/* Across a year end. */
assert.equal(daysUntil(9, 13, on(2025, 12, 31)), 256);
/* A leap February in the way adds the extra day. */
assert.equal(daysUntil(9, 13, on(2027, 9, 14)), 365);
/* A clock change inside the span must not shave a day off. */
assert.equal(daysUntil(9, 13, on(2026, 3, 1)), 196);

console.log("countdown ok");
