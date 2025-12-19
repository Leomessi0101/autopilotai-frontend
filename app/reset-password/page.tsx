"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");

    try {
      const res = await api.post("/api/auth/reset-password", {
        token,
        new_password: newPassword,
      });

      setMessage(res.data.message);
    } catch {
      setMessage("Reset failed. Token may be invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Set New Password
        </h1>

        {message && (
          <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Reset Token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              placeholder="Paste reset token here"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 border rounded-xl"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
          >
            Reset Password
          </button>
        </div>

        <div className="text-center text-gray-600 mt-6">
          Go back{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
