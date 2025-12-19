"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-lg bg-white">

        {/* Logo */}
        <h1
          className="text-3xl font-bold text-center mb-8 cursor-pointer"
          onClick={() => router.push("/")}
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Log in to access your dashboard
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-3">
            <button
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-amber-600 hover:text-amber-700 hover:underline transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition text-lg"
          >
            Login
          </button>
        </div>

        {/* Register */}
        <div className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-black hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
