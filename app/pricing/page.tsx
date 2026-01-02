"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import MarketingNavbar from "@/components/MarketingNavbar";

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
    <div className="min-h-screen text-white bg-[#05070d] relative overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[180px]" />
      </div>

      {/* NAV */}
      <div className="relative z-20">
        <MarketingNavbar />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-32 pb-28 px-6 md:px-10 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
          >
            Simple, Transparent Pricing
            <br />
            <span className="text-[#d8e3ff]">
              That Scales With You.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            No hidden fees. No contracts. Change or cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="relative z-10 px-6 md:px-10 -mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <PriceCard
            plan="Basic"
            price="19"
            desc="Great for getting started."
            features={[
              "Up to 30 AI generations per month",
              "Core content tools",
              "Email & reply templates",
              "Basic strategy suggestions",
              "Standard processing",
              "Email support",
            ]}
            current={user?.subscription_plan === "basic"}
            onChoose={() => handleSubscribe("basic")}
            isLoggedIn={isLoggedIn}
          />

          <PriceCard
            plan="Growth"
            price="49"
            highlight
            popular
            desc="Perfect for creators & businesses scaling."
            features={[
              "Everything in Basic",
              "Unlimited generations",
              "Full history & saved projects",
              "Multiple variations",
              "Advanced scheduling & guidance",
              "Priority processing",
              "Priority support",
            ]}
            current={user?.subscription_plan === "growth"}
            onChoose={() => handleSubscribe("growth")}
            isLoggedIn={isLoggedIn}
          />

          <PriceCard
            plan="Pro"
            price="99"
            desc="For power users and teams pushing hard."
            features={[
              "Everything in Growth",
              "AI image generation (coming)",
              "Long-form content",
              "Full campaign bundles",
              "Advanced analytics",
              "Highest priority queue",
              "Dedicated support",
            ]}
            current={user?.subscription_plan === "pro"}
            onChoose={() => handleSubscribe("pro")}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </section>

      {/* TRUST */}
      <section className="relative z-10 py-28 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            Flexible. Fair. In Your Control.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upgrade, downgrade, or cancel anytime from your dashboard.
            No contracts. No stress.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 py-28 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-10">
            <FaqItem question="Is there a free trial?" answer="Yes — sign up free and explore before choosing a plan. No card needed." />
            <FaqItem question="Can I change or cancel?" answer="Anytime. Upgrade, downgrade, or cancel directly in your dashboard." />
            <FaqItem question="What payments do you accept?" answer="All major credit & debit cards via Stripe." />
            <FaqItem question="Is payment secure?" answer="Yes. Everything is handled via Stripe using bank-level encryption." />
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="relative z-10 py-32 text-center px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Ready To Work Smarter?
            </h2>
            <p className="mt-8 text-xl text-gray-300">
              Join creators and businesses saving hours every week.
            </p>
            <div className="mt-12">
              <a
                href="/register"
                className="px-16 py-7 rounded-2xl text-2xl font-bold bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] shadow-[0_35px_120px_rgba(20,40,90,0.6)] hover:scale-[1.02] transition"
              >
                Start Free
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10">
        <p className="text-gray-400 text-sm">
          © 2025 AutopilotAI — Built for ambitious people.
        </p>
      </footer>
    </div>
  );
}

/* COMPONENTS */

interface PriceCardProps {
  plan: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  current: boolean;
  onChoose: () => void;
  isLoggedIn: boolean;
}

function PriceCard({
  plan,
  price,
  desc,
  features,
  highlight,
  popular,
  current,
  onChoose,
  isLoggedIn
}: PriceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`relative p-10 md:p-12 rounded-3xl border shadow-2xl ${
        highlight
          ? "border-[#2b4e8d] bg-[#0b1424]"
          : "border-white/10 bg-white/5 backdrop-blur-xl"
      }`}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-2 bg-[#2b4e8d] text-white text-sm font-bold rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-3xl font-bold">{plan}</h3>
        <p className="mt-3 text-lg text-gray-300">{desc}</p>
        <div className="mt-8">
          <span className="text-6xl font-black">${price}</span>
          <span className="text-xl text-gray-400">/month</span>
        </div>
      </div>

      <ul className="mt-10 space-y-5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="mt-1 w-2 h-2 rounded-full bg-[#6d8ce8]" />
            <span className="text-lg text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        {current ? (
          <div className="py-4 font-bold text-[#6dff9c] text-center text-lg">
            ✓ Current Plan
          </div>
        ) : (
          <button
            onClick={onChoose}
            className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] hover:scale-[1.02] transition shadow-[0_20px_80px_rgba(20,40,90,0.6)]"
          >
            {isLoggedIn ? `Choose ${plan}` : "Start Free"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-b border-white/10 pb-8"
    >
      <h4 className="text-xl md:text-2xl font-bold">{question}</h4>
      <p className="mt-4 text-lg text-gray-300 leading-relaxed">{answer}</p>
    </motion.div>
  );
}
