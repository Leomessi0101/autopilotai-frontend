"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [valid, setValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 1️⃣ Verify token on load
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      setValid(false);
      return;
    }

    api
      .post("/api/auth/verify-reset-token", { token })
      .then(() => setValid(true))
      .catch(() => {
        setValid(false);
        setError("Reset link expired or invalid.");
      });
  }, [token]);

  const handleReset = async () => {
    if (!token) {
      setError("Missing reset token");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/auth/reset-password", {
        token,
        new_password: newPassword,
      });

      setSuccess("Password successfully reset! Redirecting to login…");

      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const backend = err.response?.data?.detail;
      setError(backend || "Reset failed. Try again.");
    }

    setLoading(false);
  };

  // Invalid / expired token state
  if (valid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Reset Link Expired</h1>
          <p className="text-gray-600 mb-6">
            Your reset link is no longer valid. Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
          >
            Request new reset link
          </a>
        </div>
      </div>
    );
  }

  // Still checking the token
  if (valid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Checking reset link…
      </div>
    );
  }

  // Valid token – show form
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-8">
          Set New Password
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-xl text-green-800">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
            />
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Updating password…" : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
