"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleReset = async () => {
    setMessage("");

    try {
      const res = await api.post("/api/auth/request-password-reset", {
        email,
      });

      setMessage(res.data.message);

      // TEMP: show token so we can test reset without email service
      if (res.data.reset_token) {
        setToken(res.data.reset_token);
      }
    } catch (err: any) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter your email. If your account exists,
          we’ll prepare a reset link for you.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-4">
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
            onClick={handleReset}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
          >
            Send Reset Request
          </button>
        </div>

        {token && (
          <div className="mt-6 text-xs break-all p-3 border rounded-xl bg-gray-50">
            <p className="font-semibold mb-1">DEV Token (temporary)</p>
            {token}
          </div>
        )}

        <div className="text-center text-gray-600 mt-6">
          Remember now?{" "}
          <a href="/login" className="text-black hover:underline">
            Go back to login
          </a>
        </div>
      </div>
    </div>
  );
}
