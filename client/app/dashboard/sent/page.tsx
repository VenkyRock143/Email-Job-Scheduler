"use client";

import { useEffect, useState } from "react";
import { getSentEmails } from "@/lib/api";
import { EmailRow } from "@/types";
import Table from "@/components/Table";

export default function SentPage() {
  const [data, setData] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSentEmails()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading sent emails...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Sent Emails
      </h2>

      <Table data={data} />
    </div>
  );
}
