"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ArrowRight, Lock, Mail, User, Sparkles } from "lucide-react";

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

      // ✅ FIX: Check if they came from pricing page
      const urlParams = new URLSearchParams(window.location.search);
      const selectedPlan = urlParams.get("plan");
      
      if (selectedPlan === "starter" || selectedPlan === "pro") {
        // They selected a paid plan - send to Stripe
        try {
          const stripeRes = await api.post(`/api/stripe/create-checkout-session?plan=${selectedPlan}`);
          window.location.href = stripeRes.data.checkout_url;
          return;
        } catch {
          // Stripe failed, go to dashboard
          router.push("/dashboard");
        }
      } else {
        // Free plan or no plan - go to dashboard
        router.push("/dashboard");
      }
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
    <div className="min-h-screen text-white bg-[#0a0a0f] relative flex items-center justify-center px-6 overflow-hidden">

      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d14] via-[#0a0a0f] to-black" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full blur-[120px] opacity-20"
          animate={{ 
            opacity: [0.15, 0.25, 0.18],
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 -right-1/4 h-[700px] w-[700px] rounded-full blur-[120px] opacity-15"
          animate={{ 
            opacity: [0.12, 0.22, 0.15],
            scale: [1, 1.15, 1.05],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <button
            onClick={() => router.push("/")}
            className="group inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300"
          >
            {/* Logo icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <span className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AutopilotAI
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl opacity-60" />
          
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Get Started
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-400">
                Start building your AI website in seconds
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all duration-300 shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all duration-300 shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all duration-300 shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="group relative w-full py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white overflow-hidden shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </button>
            </div>

            {/* Login link */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                >
                  Sign in
                </button>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-600">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="text-gray-500 hover:text-gray-400 transition-colors">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-gray-500 hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors duration-300"
          >
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}