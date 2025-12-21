"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  subscription_plan: "basic" | "growth" | "pro";
};

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");

    const token = localStorage.getItem("autopilot_token");
    setIsLoggedIn(!!token);

    if (token) {
      api
        .get("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("autopilot-theme", next);
  };

  const isDark = theme === "dark";

  const handleSubscribe = async (plan: "basic" | "growth" | "pro") => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      window.location.href = "/register";
      return;
    }

    if (user?.subscription_plan === plan) return;

    try {
      const res = await api.post(
        `/api/stripe/create-checkout-session?plan=${plan}`
      );
      window.location.href = res.data.checkout_url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark ? "bg-[#0B0B0E] text-white" : "bg-white text-black"
      }`}
    >
      {/* NAVBAR */}
      <header
        className={`w-full py-6 px-8 md:px-12 flex justify-between items-center border-b sticky top-0 backdrop-blur-xl z-50 ${
          isDark ? "border-gray-800 bg-[#0B0B0E]/80" : "border-gray-200 bg-white/80"
        }`}
      >
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <div className="flex gap-6 items-center text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/features" className="hover:underline">Features</a>
          {!isLoggedIn && <a href="/login" className="hover:underline">Login</a>}

          <a
            href={isLoggedIn ? "/dashboard" : "/register"}
            className={`px-5 py-2 rounded-full text-white transition ${
              isDark ? "bg-amber-500 text-black" : "bg-black hover:bg-gray-900"
            }`}
          >
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </a>

          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-full border text-xs transition ${
              isDark
                ? "border-gray-700 hover:border-amber-500"
                : "border-gray-300 hover:border-black"
            }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="px-8 md:px-20 pt-20 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold"
        >
          Simple, Honest
          <span className="text-amber-500"> Pricing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 text-lg md:text-xl ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No hidden fees. No contracts. Cancel anytime.
          You stay in control — always.
        </motion.p>
      </section>

      {/* PRICING GRID */}
      <section className="mt-24 px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        <PriceCard
          theme={theme}
          plan="Basic"
          price="19"
          desc="Perfect for individuals & small businesses."
          features={[
            "30-day content generator",
            "Email & reply templates",
            "Ad & campaign generator",
            "Save up to 5 projects",
            "Standard processing speed",
          ]}
          current={user?.subscription_plan === "basic"}
          onChoose={() => handleSubscribe("basic")}
        />

        <PriceCard
          theme={theme}
          plan="Growth"
          price="49"
          highlight
          desc="The best plan for momentum & real growth."
          features={[
            "Everything in Basic",
            "Unlimited generations",
            "Full history",
            "Multiple variations per request",
            "AI scheduling & tips",
            "Faster processing",
            "Priority support",
          ]}
          current={user?.subscription_plan === "growth"}
          onChoose={() => handleSubscribe("growth")}
        />

        <PriceCard
          theme={theme}
          plan="Pro"
          price="99"
          desc="For serious businesses scaling aggressively."
          features={[
            "Everything in Growth",
            "AI image generation",
            "Long-form blogs",
            "Campaign bundles",
            "Advanced automation",
            "Highest priority queue",
          ]}
          current={user?.subscription_plan === "pro"}
          onChoose={() => handleSubscribe("pro")}
        />
      </section>

      {/* GUARANTEE */}
      <section className="mt-28 px-8 md:px-12 max-w-4xl mx-auto text-center">
        <div
          className={`border rounded-3xl p-10 shadow-xl ${
            isDark ? "bg-[#0F0F14] border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-3xl font-bold">Built For Growth — Not Lock-In</h3>
          <p
            className={`mt-3 text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Upgrade, downgrade, pause, or cancel anytime.
            No contracts. No stress.
          </p>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <div className="text-center mt-24 pb-20 px-6">
          <h2 className="text-3xl font-bold">
            Ready to put your business on Autopilot?
          </h2>
          <p className={isDark ? "text-gray-400 mt-3" : "text-gray-600 mt-3"}>
            Join forward-thinking businesses using AI to scale faster.
          </p>

          <a
            href="/register"
            className={`inline-block mt-8 px-10 py-4 rounded-full text-lg text-white hover:opacity-90 transition shadow-xl ${
              isDark ? "bg-amber-500 text-black" : "bg-black"
            }`}
          >
            Get Started
          </a>
        </div>
      )}

      {/* FOOTER */}
      <footer
        className={`border-t py-10 text-center ${
          isDark
            ? "border-gray-800 text-gray-500"
            : "border-gray-200 text-gray-500"
        }`}
      >
        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

/* ============ COMPONENTS ============ */

function PriceCard({
  plan,
  price,
  desc,
  features,
  highlight,
  onChoose,
  current,
  theme,
}: any) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-10 rounded-3xl text-center shadow-xl border ${
        highlight
          ? "scale-[1.04] border-amber-500"
          : isDark
          ? "bg-[#0F0F14] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      {highlight && (
        <div className="mb-4">
          <span className="px-3 py-1 bg-amber-500 text-black text-xs rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold">{plan}</h3>
      <p className={isDark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
        {desc}
      </p>

      <div className="text-5xl font-bold mt-6">
        ${price}
        <span className="text-lg font-normal">/mo</span>
      </div>

      <ul className="text-left mt-8 space-y-3">
        {features.map((f: string, idx: number) => (
          <li
            key={idx}
            className={`flex items-center gap-3 ${
              isDark ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                highlight
                  ? "bg-amber-500"
                  : isDark
                  ? "bg-gray-300"
                  : "bg-black"
              }`}
            ></span>
            {f}
          </li>
        ))}
      </ul>

      {current ? (
        <div className="mt-10 font-semibold text-green-500">
          Current Plan
        </div>
      ) : (
        <button
          onClick={onChoose}
          className={`w-full mt-10 px-6 py-3 rounded-full text-white hover:opacity-90 transition shadow-lg ${
            highlight
              ? "bg-amber-500 text-black"
              : isDark
              ? "bg-amber-500 text-black"
              : "bg-black"
          }`}
        >
          Choose {plan}
        </button>
      )}
    </motion.div>
  );
}
