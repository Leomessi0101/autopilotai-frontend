"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("autopilot_token")
        : null;

    if (token) router.push("/dashboard");
  }, [router]);

  const handleLogin = async () => {
    setError("");

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

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const subscription = res.data.subscription_plan || res.data.subscription;

      localStorage.setItem("autopilot_token", token);
      if (subscription) localStorage.setItem("autopilot_subscription", subscription);

      router.push("/dashboard");
    } catch (err: any) {
      const backendError = err.response?.data?.detail;

      if (typeof backendError === "string") {
        setError(backendError);
      } else {
        setError("Login failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">

        {/* Branding */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Log back into AutopilotAI and continue building.
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
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              type="password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-black hover:underline cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
