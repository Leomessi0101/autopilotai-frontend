"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (token) router.push("/dashboard");
  }, [router]);

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
      setError(
        typeof backendError === "string"
          ? backendError
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#05070d] relative flex items-center justify-center px-6 overflow-hidden">

      {/* Background Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[180px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-wide">
            AutopilotAI
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.6)]">
          <h2 className="text-3xl font-semibold text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-gray-300 mb-8">
            Get started in seconds
          </p>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/40 text-red-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b4e8d] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b4e8d] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b4e8d] transition"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] shadow-[0_25px_80px_rgba(20,40,90,0.6)] hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </div>

          {/* Login */}
          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-[#6d8ce8] hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
