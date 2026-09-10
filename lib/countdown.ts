export function daysUntil(month: number, day: number, now: Date): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisYear = new Date(today.getFullYear(), month - 1, day);
  const next =
    thisYear < today
      ? new Date(today.getFullYear() + 1, month - 1, day)
      : thisYear;

  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}
