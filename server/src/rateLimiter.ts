import redis from "./redis";

export async function checkHourlyLimit(
  senderEmail: string,
  maxPerHour: number
): Promise<{ allowed: boolean; retryAt?: Date }> {
  const now = new Date();

  const hourKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;
  const key = `rate:${senderEmail}:${hourKey}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600);
  }

  if (count > maxPerHour) {
    const nextHour = new Date(now);
    nextHour.setUTCHours(now.getUTCHours() + 1, 0, 0, 0);
    return { allowed: false, retryAt: nextHour };
  }

  return { allowed: true };
}
