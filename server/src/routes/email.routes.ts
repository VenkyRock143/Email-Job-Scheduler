import { Router } from "express";
import prisma from "../db";
import { emailQueue } from "../queue";

const router = Router();

router.post("/schedule", async (req, res) => {
  try {
    const {
      senderEmail,
      emails,
      subject,
      body,
      scheduledAt,
    } = req.body;

    if (
      !senderEmail ||
      !emails ||
      !subject ||
      !body ||
      !scheduledAt
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const runAt = new Date(scheduledAt);
    const delay = runAt.getTime() - Date.now();

    if (delay < 0) {
      return res.status(400).json({ message: "Time already passed" });
    }

    for (const toEmail of emails) {
      const email = await prisma.email.create({
        data: {
          senderEmail,
          toEmail,
          subject,
          body,
          scheduledAt: runAt,
          status: "scheduled",
        },
      });

      await emailQueue.add(
        "send_email",
        { emailId: email.id },
        { delay }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to schedule" });
  }
});

router.get("/scheduled", async (_, res) => {
  const emails = await prisma.email.findMany({
    where: { status: "scheduled" },
    orderBy: { scheduledAt: "asc" },
  });

  res.json(
    emails.map((e) => ({
      id: e.id,
      email: e.toEmail,
      subject: e.subject,
      status: e.status,
      time: e.scheduledAt,
    }))
  );
});

router.get("/sent", async (_, res) => {
  const emails = await prisma.email.findMany({
    where: { status: "sent" },
    orderBy: { sentAt: "desc" },
  });

  res.json(
    emails.map((e) => ({
      id: e.id,
      email: e.toEmail,
      subject: e.subject,
      status: e.status,
      time: e.sentAt,
    }))
  );
});

export default router;
