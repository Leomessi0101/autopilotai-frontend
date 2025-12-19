"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    setMessage("");

    try {
      await api.post("/api/auth/reset-password", {
        token: token,
        new_password: password,
      });

      setMessage("Password reset successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      if (backendError) setMessage(backendError);
      else setMessage("Reset failed. Try again.");
    }
  };

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid or missing reset token.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">

        <h1 className="text-3xl font-bold text-center mb-8">
          Reset Password
        </h1>

        {message && (
          <p className="text-center text-sm mb-4 text-gray-700">
            {message}
          </p>
        )}

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4"
        />

        <button
          onClick={handleReset}
          className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
