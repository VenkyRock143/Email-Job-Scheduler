import { EmailRow } from "@/types";

export default function Table({
  data,
}: {
  data: EmailRow[];
}) {
  if (!data.length) {
    return (
      <p className="text-sm text-gray-500">
        No records found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left font-medium">
              Email
            </th>
            <th className="p-3 text-left font-medium">
              Subject
            </th>
            <th className="p-3 text-left font-medium">
              Status
            </th>
            <th className="p-3 text-left font-medium">
              Time
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b last:border-b-0"
            >
              <td className="p-3">
                {row.email}
              </td>
              <td className="p-3">
                {row.subject}
              </td>
              <td className="p-3 capitalize">
                {row.status}
              </td>
              <td className="p-3">
                {new Date(row.time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
