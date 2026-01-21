"use client";

import { useEffect, useState } from "react";
import { getScheduledEmails } from "@/lib/api";
import { EmailRow } from "@/types";
import Table from "@/components/Table";

export default function ScheduledPage() {
  const [data, setData] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScheduledEmails()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading scheduled emails...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Scheduled Emails
      </h2>

      <Table data={data} />
    </div>
  );
}
