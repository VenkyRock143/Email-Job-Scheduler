export const WORKER_CONCURRENCY =
  Number(process.env.WORKER_CONCURRENCY || 5);

export const MIN_DELAY_MS =
  Number(process.env.MIN_DELAY_MS || 2000);

export const MAX_EMAILS_PER_HOUR_PER_SENDER =
  Number(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || 100);
