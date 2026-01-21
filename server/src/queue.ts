import { Queue } from "bullmq";

export const emailQueue = new Queue("email_queue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  limiter: {
    max: 1,
    duration: Number(process.env.MIN_DELAY_MS || 2000),
  },
});
