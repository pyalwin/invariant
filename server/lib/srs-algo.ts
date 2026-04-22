/**
 * SM-2 lite implementation.
 * Called with the current card state and a grade 0–5.
 * Returns updated { ease, interval_days }.
 *
 * Grade scale:
 *   0 — complete blackout, no recall
 *   1 — wrong but recognized on hint
 *   2 — wrong but easy to recall
 *   3 — correct with difficulty
 *   4 — correct with hesitation
 *   5 — perfect recall
 */
export function sm2(
  ease: number,
  intervalDays: number,
  grade: number,
): { ease: number; intervalDays: number } {
  let newEase = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (newEase < 1.3) newEase = 1.3;

  let newInterval: number;
  if (grade < 3) {
    newInterval = 1;
  } else if (intervalDays === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(intervalDays * newEase);
  }

  return { ease: newEase, intervalDays: newInterval };
}

/** Calculate the next due timestamp in seconds since epoch */
export function nextDue(intervalDays: number): number {
  return Math.floor(Date.now() / 1000) + intervalDays * 86400;
}