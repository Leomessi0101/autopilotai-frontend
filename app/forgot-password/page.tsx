"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      await api.post("/api/auth/forgot-password", {
        email: email.trim(),
      });

      setStatus("sent");
      setMessage("Reset link sent! Check your email.");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(
        err?.response?.data?.detail ||
          "Something went wrong. Try again later."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">Forgot password?</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email and we’ll send you a reset link.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm ${
              status === "sent"
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-red-100 border border-red-300 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
              placeholder="you@example.com"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </div>
    </div>
  );
}
