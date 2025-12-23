"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return;

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
        err?.response?.data?.detail || "Something went wrong. Please try again later."
      );
    }
  };

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
            Forgot Password
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your email and we’ll send you a password reset link.
          </p>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm border ${
                status === "sent"
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Send Reset Link"}
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