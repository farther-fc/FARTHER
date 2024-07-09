import later from "later";

export function getLatestCronTime(cron: string): Date {
  const now = new Date();
  // Find the last occurrence before now
  const s = later.parse.cron(cron);
  const prev = later.schedule(s).prev(1, now);
  return Array.isArray(prev) ? prev[0] : prev;
}
