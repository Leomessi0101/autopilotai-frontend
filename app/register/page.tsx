"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";

  /* Redirect if logged in */
  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("autopilot_token")
        : null;

    if (token) router.push("/dashboard");
  }, [router]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("autopilot-theme", next);
  };

  const handleRegister = async () => {
    setError("");

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const loginRes = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = loginRes.data.token;
      const subscription =
        loginRes.data.subscription_plan || loginRes.data.subscription;

      localStorage.setItem("autopilot_token", token);
      if (subscription)
        localStorage.setItem("autopilot_subscription", subscription);

      router.push("/dashboard");
    } catch (err: any) {
      const backendError = err.response?.data?.detail;

      if (typeof backendError === "string") setError(backendError);
      else setError("Registration failed. Please try again.");
    }

    setLoading(false);
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
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Your Account
        </h1>
        <p
          className={`text-center mb-7 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Get started with AutopilotAI in seconds.
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
              className={`block mb-1 text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition ${
                isDark
                  ? "bg-[#13131A] border-gray-700 focus:border-amber-500"
                  : "bg-gray-50 border-gray-300 focus:border-black"
              }`}
              placeholder="John Smith"
            />
          </div>

          <div>
            <label
              className={`block mb-1 text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
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
              className={`block mb-1 text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              type="password"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition ${
                isDark
                  ? "bg-[#13131A] border-gray-700 focus:border-amber-500"
                  : "bg-gray-50 border-gray-300 focus:border-black"
              }`}
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-lg hover:opacity-90 transition shadow-lg disabled:opacity-60 ${
              isDark ? "bg-amber-500 text-black" : "bg-black text-white"
            }`}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>

        {/* Footer */}
        <div
          className={`text-center mt-6 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className={`cursor-pointer ${
              isDark ? "text-amber-400" : "text-black"
            } hover:underline`}
          >
            Login
          </span>
        </div>
      </motion.div>
    </div>
  );
}
