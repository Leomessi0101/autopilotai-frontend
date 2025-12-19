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

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    setIsLoggedIn(!!token);

    if (token) {
      api
        .get("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

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
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <div className="w-full py-8 px-10 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight">
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>
      </div>

      {/* HERO */}
      <section className="px-10 pt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold"
        >
          Simple, Transparent Pricing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Choose the plan that fits your business. Cancel anytime.
        </motion.p>
      </section>

      {/* PRICING CARDS */}
      <section className="mt-28 px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <PriceCard
          plan="Basic"
          price="19"
          desc="Perfect for small businesses getting started with automation."
          features={[
            "30-day content generator",
            "Email/autoresponder templates",
            "Ad & campaign generator",
            "Save last 5 projects",
          ]}
          current={user?.subscription_plan === "basic"}
          onChoose={() => handleSubscribe("basic")}
        />

        <PriceCard
          plan="Growth"
          price="49"
          highlight
          desc="Unlimited automation & content for scaling businesses."
          features={[
            "Everything in Basic",
            "Unlimited generations",
            "Project history",
            "Multiple variations",
            "AI scheduling suggestions",
            "Faster generation",
          ]}
          current={user?.subscription_plan === "growth"}
          onChoose={() => handleSubscribe("growth")}
        />

        <PriceCard
          plan="Pro"
          price="99"
          desc="Full power, AI images & priority processing."
          features={[
            "Everything in Growth",
            "AI image generation",
            "Blog/article writer",
            "Campaign bundles",
            "Priority queue",
          ]}
          current={user?.subscription_plan === "pro"}
          onChoose={() => handleSubscribe("pro")}
        />
      </section>

      {/* CTA — ONLY FOR NOT LOGGED IN USERS */}
      {!isLoggedIn && (
        <div className="mt-20 text-center pb-32">
          <h2 className="text-3xl font-bold">
            Ready to automate your business?
          </h2>
          <p className="text-gray-600 mt-3">
            Start your free trial today.
          </p>

          <a
            href="/register"
            className="inline-block mt-8 px-10 py-4 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition"
          >
            Start Free Trial
          </a>
        </div>
      )}

      <footer className="border-t py-10 text-center text-gray-500">
        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

function PriceCard({
  plan,
  price,
  desc,
  features,
  highlight,
  onChoose,
  current,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`p-10 rounded-3xl border shadow-sm bg-white text-center ${
        highlight ? "border-black shadow-lg scale-105" : "border-gray-200"
      }`}
    >
      {highlight && (
        <div className="mb-4">
          <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold">{plan}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>

      <div className="text-5xl font-bold mt-6">${price}</div>
      <div className="text-gray-600 mt-1">per month</div>

      <ul className="text-left mt-8 space-y-3">
        {features.map((f: any, idx: number) => (
          <li key={idx} className="flex items-center gap-3 text-gray-800">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            {f}
          </li>
        ))}
      </ul>

      {current ? (
        <div className="mt-10 font-semibold text-green-600">
          Current Plan
        </div>
      ) : (
        <button
          onClick={onChoose}
          className="block w-full mt-10 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
        >
          Choose {plan}
        </button>
      )}
    </motion.div>
  );
}
