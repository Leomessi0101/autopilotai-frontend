"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await api.post("/api/auth/login", { email, password });

      const token = res.data.token;
      const subscription = res.data.subscription_plan;

      localStorage.setItem("autopilot_token", token);
      localStorage.setItem("autopilot_subscription", subscription);

      router.push("/dashboard");
    } catch (err: any) {
      const backendError = err.response?.data?.detail;

      if (typeof backendError === "string") {
        setError(backendError);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleForgotPassword = () => {
    setError("");
    setMessage(
      "Password reset feature is being added soon. For now, contact support if you need help."
    );
  };

  const handleResendVerification = () => {
    setError("");
    setMessage(
      "If your email requires verification, it will be supported soon."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome Back
        </h1>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
          >
            Login
          </button>
        </div>

        <div className="flex justify-between text-sm mt-5">
          <button
            onClick={handleForgotPassword}
            className="text-gray-600 hover:underline"
          >
            Forgot password?
          </button>

          <button
            onClick={handleResendVerification}
            className="text-gray-600 hover:underline"
          >
            Resend verification
          </button>
        </div>

        <div className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-black hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
