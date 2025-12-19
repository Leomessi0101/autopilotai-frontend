"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Redirect if logged in */
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("autopilot_token")
        : null;

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

      // 1️⃣ Register user
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // 2️⃣ Instantly login
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

      if (typeof backendError === "string") {
        setError(backendError);
      } else {
        setError("Registration failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get started with AutopilotAI in seconds.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black bg-gray-50"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              type="email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              type="password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-black hover:underline cursor-pointer"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
