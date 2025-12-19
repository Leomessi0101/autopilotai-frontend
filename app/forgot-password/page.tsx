"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage(null);

    try {
      const res = await api.post("/api/auth/forgot-password", { email });

      setMessage(
        "We generated a secure reset link. Since email isn’t active yet, we’ll redirect you now."
      );

      setTimeout(() => {
        router.push(`/reset-password?token=${res.data.token}`);
      }, 2000);
    } catch (err: any) {
      const backend = err.response?.data?.detail;
      setError(backend || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter your email and we’ll help you recover your account.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-xl text-green-800">
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Generating reset link..." : "Send reset link"}
          </button>
        </div>

        <div className="text-center text-gray-600 mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-black font-semibold">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
