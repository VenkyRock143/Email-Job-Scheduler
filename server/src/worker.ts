import { Worker } from "bullmq";
import prisma from "./db";
import { sendEmail } from "./mailer";
import {
  WORKER_CONCURRENCY,
  MAX_EMAILS_PER_HOUR_PER_SENDER,
} from "./config";
import { checkHourlyLimit } from "./rateLimiter";

new Worker(
  "email_queue",
  async (job) => {
    const { emailId } = job.data;

    const email = await prisma.email.findUnique({
      where: { id: emailId },
    });

    if (!email || email.status === "sent") return;

    const rate = await checkHourlyLimit(
      email.senderEmail,
      MAX_EMAILS_PER_HOUR_PER_SENDER
    );

    if (!rate.allowed && rate.retryAt) {
      const delay = rate.retryAt.getTime() - Date.now();

      await job.queue.add(
        "send_email",
        { emailId },
        { delay }
      );

      return;
    }

    try {
      await sendEmail(
        email.senderEmail,
        email.toEmail,
        email.subject,
        email.body
      );

      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      });
    } catch (error: any) {
      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "failed",
          errorMessage: error.message,
        },
      });
      throw error;
    }
  },
  {
    concurrency: WORKER_CONCURRENCY,
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);

console.log("Worker running");
