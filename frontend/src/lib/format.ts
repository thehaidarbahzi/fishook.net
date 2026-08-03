export function formatTimeRemaining(expiresAt: string, now: number = Date.now()): string {
  const remaining = new Date(expiresAt).getTime() - now;
  if (remaining <= 0) return "Expired";

  const totalMinutes = Math.floor(remaining / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `Expires in: ${days}d ${hours}h`;
  if (hours > 0) return `Expires in: ${hours}h ${minutes}m`;
  return `Expires in: ${minutes}m`;
}