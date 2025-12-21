"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("autopilot-theme", next);
  };

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

      if (typeof backendError === "string") setError(backendError);
      else setError("Login failed. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-all duration-500 ${
        isDark
          ? "bg-[#0B0B0E] text-white"
          : "bg-gradient-to-br from-white to-gray-50 text-black"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 px-4 py-2 rounded-full border text-sm transition ${
          isDark
            ? "border-gray-700 hover:border-amber-500"
            : "border-gray-300 hover:border-black"
        }`}
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md p-8 md:p-10 rounded-3xl border shadow-xl ${
          isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        {/* Logo */}
        <h1
          className="text-3xl font-bold text-center mb-7 cursor-pointer"
          onClick={() => router.push("/")}
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-1">
          Welcome Back
        </h2>
        <p
          className={`text-center mb-6 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Log in to access your dashboard
        </p>

        {/* Error */}
        {error && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm ${
              isDark
                ? "bg-red-900/30 border border-red-700 text-red-200"
                : "bg-red-100 border border-red-300 text-red-800"
            }`}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition ${
                isDark
                  ? "bg-[#13131A] border-gray-700 focus:border-amber-500"
                  : "bg-gray-50 border-gray-300 focus:border-black"
              }`}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              className={`block text-sm mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition ${
                isDark
                  ? "bg-[#13131A] border-gray-700 focus:border-amber-500"
                  : "bg-gray-50 border-gray-300 focus:border-black"
              }`}
              placeholder="••••••••"
            />
          </div>

          {/* Forgot */}
          <div className="flex justify-end -mt-3">
            <button
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-amber-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login */}
          <button
            onClick={handleLogin}
            className={`w-full py-3 rounded-xl text-lg hover:opacity-90 transition shadow-lg ${
              isDark ? "bg-amber-500 text-black" : "bg-black text-white"
            }`}
          >
            Login
          </button>
        </div>

        {/* Register */}
        <div
          className={`text-center mt-6 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className={`${
              isDark ? "text-amber-400" : "text-black"
            } hover:underline`}
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
}
