import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r p-4">
      <nav className="flex flex-col gap-4 text-sm">
        <Link
          href="/dashboard/scheduled"
          className="hover:text-black text-gray-600"
        >
          Scheduled Emails
        </Link>

        <Link
          href="/dashboard/sent"
          className="hover:text-black text-gray-600"
        >
          Sent Emails
        </Link>

        <Link
          href="/dashboard/compose"
          className="hover:text-black text-gray-600"
        >
          Compose
        </Link>
      </nav>
    </aside>
  );
}
