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
      const subscription = loginRes.data.subscription_plan || loginRes.data.subscription;

      localStorage.setItem("autopilot_token", token);
      if (subscription) localStorage.setItem("autopilot_subscription", subscription);

      router.push("/dashboard");
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      setError(typeof backendError === "string" ? backendError : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Get started with AutopilotAI in seconds
          </p>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-60"
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-blue-900 hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}