"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CSVUploader from "@/components/CSVUploader";
import Button from "@/components/Button";
import { scheduleEmails } from "@/lib/api";

export default function ComposePage() {
  const { data } = useSession();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [hourlyLimit, setHourlyLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    if (!subject || !body || !emails.length || !startTime) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await scheduleEmails({
        senderEmail: data?.user?.email || "",
        subject,
        body,
        emails,
        scheduledAt: new Date(startTime).toISOString(),
        delaySeconds,
        hourlyLimit,
      });

      setSubject("");
      setBody("");
      setEmails([]);
      setStartTime("");
      setDelaySeconds(2);
      setHourlyLimit(100);

      alert("Emails scheduled successfully");
    } catch {
      setError("Failed to schedule emails");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold mb-4">
        Compose Email
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Body"
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="mb-3">
        <CSVUploader onEmailsParsed={setEmails} />
        <p className="text-sm mt-2 text-gray-500">
          Emails detected: {emails.length}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">
          Start time
        </label>
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">
            Delay between emails (seconds)
          </label>
          <input
            type="number"
            min={1}
            className="border p-2 w-full"
            value={delaySeconds}
            onChange={(e) =>
              setDelaySeconds(Number(e.target.value))
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Hourly limit
          </label>
          <input
            type="number"
            min={1}
            className="border p-2 w-full"
            value={hourlyLimit}
            onChange={(e) =>
              setHourlyLimit(Number(e.target.value))
            }
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-3">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Scheduling..." : "Schedule"}
      </Button>
    </div>
  );
}
