"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setStatus("sending");

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/request-password-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(email),
        }
      );

      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">

        <h1 className="text-3xl font-bold text-center mb-3">
          Reset Password
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Enter your email and we’ll send you a reset link.
        </p>

        {status === "sent" ? (
          <div className="p-4 bg-green-100 border border-green-300 rounded-xl text-green-800">
            If an account exists, a reset link has been sent to your email.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-1">
                  Email
                </label>
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
                disabled={status === "sending"}
                className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </>
        )}

        <div className="text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
