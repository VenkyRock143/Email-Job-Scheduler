"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/Button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-lg p-8">
        <h1 className="text-center text-3xl font-semibold mb-6">
          Login
        </h1>

        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard/scheduled",
            })
          }
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
