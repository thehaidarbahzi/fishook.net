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

export function formatLogTime(createdAt: string): string {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function summarizeBody(body: unknown, max = 60): string {
  if (body === null || body === undefined) return "No body";
  if (typeof body === "string") {
    return body.length > max ? `${body.slice(0, max)}…` : body;
  }
  try {
    const json = JSON.stringify(body);
    return json.length > max ? `${json.slice(0, max)}…` : json;
  } catch {
    return String(body);
  }
}