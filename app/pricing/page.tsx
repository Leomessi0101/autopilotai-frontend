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
    <div className="min-h-screen bg-white text-black">
      <MarketingNavbar />

      {/* HERO */}
      <section className="pt-28 pb-32 px-6 md:px-10 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Simple, transparent pricing
            <br />
            <span className="text-amber-600">that scales with you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            No hidden fees. No long-term contracts. Cancel or change plans anytime.
          </motion.p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="px-6 md:px-10 -mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <PriceCard
            plan="Basic"
            price="19"
            desc="Great for getting started and testing the waters."
            features={[
              "Up to 30 AI generations per month",
              "Core content & ad copy tools",
              "Email & reply templates",
              "Basic strategy suggestions",
              "Standard processing speed",
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
            desc="Perfect for creators and businesses ready to scale consistently."
            features={[
              "Everything in Basic",
              "Unlimited generations",
              "Full history & saved projects",
              "Multiple variations per request",
              "Advanced AI scheduling & daily tips",
              "Faster processing & priority queue",
              "Priority email support",
            ]}
            popular
            current={user?.subscription_plan === "growth"}
            onChoose={() => handleSubscribe("growth")}
            isLoggedIn={isLoggedIn}
          />

          <PriceCard
            plan="Pro"
            price="99"
            desc="Built for power users and teams scaling aggressively."
            features={[
              "Everything in Growth",
              "AI image generation (coming soon)",
              "Long-form content (blogs, threads)",
              "Full campaign bundles & automation",
              "Advanced analytics & insights",
              "Highest priority processing",
              "Dedicated support channel",
            ]}
            current={user?.subscription_plan === "pro"}
            onChoose={() => handleSubscribe("pro")}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </section>

      {/* GUARANTEE + TRUST */}
      <section className="py-28 px-6 md:px-10 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10">
            Built for flexibility, not lock-in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="p-8">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold">30-Day Money-Back Guarantee</h3>
              <p className="mt-3 text-gray-600">
                Try risk-free. Full refund if it’s not for you.
              </p>
            </div>
            <div className="p-8">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold">Change Plans Anytime</h3>
              <p className="mt-3 text-gray-600">
                Upgrade, downgrade, or cancel instantly — no questions asked.
              </p>
            </div>
            <div className="p-8">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold">No Long-Term Contracts</h3>
              <p className="mt-3 text-gray-600">
                Month-to-month billing. You’re always in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-10">
            <FaqItem question="Is there a free trial?" answer="Yes — sign up for free and explore all features before choosing a paid plan. No card required." />
            <FaqItem question="Can I change or cancel my plan?" answer="Absolutely. You can upgrade, downgrade, or cancel directly from your dashboard at any time." />
            <FaqItem question="What payment methods do you accept?" answer="We accept all major credit cards and debit cards via Stripe — secure and reliable." />
            <FaqItem question="Is my payment information secure?" answer="Yes. All payments are processed through Stripe with bank-level encryption. We never store your card details." />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {!isLoggedIn && (
        <section className="py-32 px-6 md:px-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Ready to run on autopilot?
            </h2>
            <p className="mt-8 text-xl md:text-2xl text-gray-600">
              Join thousands of creators and businesses already saving hours every week.
            </p>
            <div className="mt-12">
              <a
                href="/register"
                className="inline-block px-16 py-7 bg-black text-white font-bold text-2xl rounded-full hover:bg-gray-900 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
              >
                Start Free Today
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-16 text-center text-gray-500">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <a href="/" className="mx-5 hover:text-amber-600 transition font-medium">Home</a>
            <a href="/features" className="mx-5 hover:text-amber-600 transition font-medium">Features</a>
            <a href="/pricing" className="mx-5 hover:text-amber-600 transition font-medium">Pricing</a>
            <a href="/login" className="mx-5 hover:text-amber-600 transition font-medium">Login</a>
            <a href="mailto:contact@autopilotai.dev" className="mx-5 hover:text-amber-600 transition font-medium">Contact</a>
          </div>
          <p className="text-sm">© 2025 AutopilotAI. All rights reserved.</p>
        </div>
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

function PriceCard({ plan, price, desc, features, highlight, popular, current, onChoose, isLoggedIn }: PriceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`relative p-10 md:p-12 rounded-3xl border-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-3 ${
        highlight
          ? "border-amber-500 bg-amber-50 scale-105"
          : "border-gray-200 bg-white"
      }`}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-2 bg-amber-500 text-black text-sm font-bold rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-3xl font-extrabold">{plan}</h3>
        <p className="mt-3 text-lg text-gray-600">{desc}</p>
        <div className="mt-8">
          <span className="text-6xl font-extrabold">${price}</span>
          <span className="text-xl font-medium text-gray-500">/month</span>
        </div>
      </div>

      <ul className="mt-10 space-y-5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${highlight ? "bg-amber-600" : "bg-black"}`} />
            <span className="text-lg text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        {current ? (
          <div className="py-4 font-bold text-green-500 text-center text-lg">✓ Current Plan</div>
        ) : (
          <button
            onClick={onChoose}
            className={`w-full py-5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
              highlight ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {isLoggedIn ? `Choose ${plan}` : "Start Free Trial"}
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
      className="border-b border-gray-300 pb-8"
    >
      <h4 className="text-xl md:text-2xl font-bold">{question}</h4>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">{answer}</p>
    </motion.div>
  );
}