"use client";

import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data } = useSession();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">
        ReachInbox
      </h1>

      <div className="flex items-center gap-4 text-sm">
        {data?.user?.image && (
          <img
            src={data.user.image}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        )}

        <div className="flex flex-col text-right">
          <span className="font-medium">
            {data?.user?.name}
          </span>
          <span className="text-gray-500">
            {data?.user?.email}
          </span>
        </div>

        <button
          onClick={() =>
            signOut({ callbackUrl: "/login" })
          }
          className="text-blue-600 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
