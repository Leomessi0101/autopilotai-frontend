"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import api from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setMessage("");
    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        token: token,
        new_password: password,
      });

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      setMessage(backendError || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xl text-gray-700">Invalid or missing reset token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">
            AutopilotAI
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <h2 className="text-3xl font-light text-gray-900 text-center mb-2">
            Reset Password
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your new password below.
          </p>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm border ${
                message.includes("successfully")
                  ? "bg-teal-50 border-teal-200 text-teal-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading || !password.trim()}
              className="w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-60"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </div>

          {/* Back to Login */}
          <p className="text-center text-gray-600 mt-8">
            Remembered your password?{" "}
            <a href="/login" className="font-medium text-blue-900 hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}