"use client";

import Papa from "papaparse";

export default function CSVUploader({
  onEmailsParsed,
}: {
  onEmailsParsed: (emails: string[]) => void;
}) {
  function handleFile(file: File) {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        const emails = result.data
          .flat()
          .filter(
            (value): value is string =>
              typeof value === "string" &&
              value.includes("@")
          );

        onEmailsParsed(emails);
      },
    });
  }

  return (
    <input
      type="file"
      accept=".csv"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleFile(e.target.files[0]);
        }
      }}
    />
  );
}
