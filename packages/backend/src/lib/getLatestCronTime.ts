import later from "later";

export function getLatestCronTime(cron: string) {
  const now = new Date();
  // Find the last occurrence before now
  const s = later.parse.cron(cron);
  const prev = later.schedule(s).prev(1, now);
  const date = Array.isArray(prev) ? prev[0] : prev;
  return date.toISOString();
}
