"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      const backendError = err.response?.data?.detail;

      if (typeof backendError === "string") {
        setError(backendError);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 border border-gray-200 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Your Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
              placeholder="John Smith"
            />
          </div>

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
            onClick={handleRegister}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
          >
            Create Account
          </button>
        </div>

        <div className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
