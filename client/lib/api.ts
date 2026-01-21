const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getScheduledEmails() {
  const res = await fetch(`${API_URL}/emails/scheduled`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load scheduled emails");
  }

  return res.json();
}

export async function getSentEmails() {
  const res = await fetch(`${API_URL}/emails/sent`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load sent emails");
  }

  return res.json();
}

export async function scheduleEmails(payload: {
  senderEmail: string;
  subject: string;
  body: string;
  emails: string[];
  scheduledAt: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/emails/schedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to schedule emails");
  }

  return res.json();
}
