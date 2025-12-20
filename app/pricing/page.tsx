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
      <header className="w-full py-8 px-10 border-b border-gray-200 flex justify-between items-center">
        <h1
          className="text-2xl font-bold tracking-tight cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          AutopilotAI
        </h1>
        <a
          href="/login"
          className="px-6 py-2 border rounded-full hover:border-black transition"
        >
          Account
        </a>
      </header>

      {/* HERO */}
      <section className="px-10 pt-24 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold"
        >
          Simple, Honest Pricing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-gray-600"
        >
          No hidden fees. No contracts. Cancel anytime.
          <br />
          Choose the plan that actually helps your business move forward.
        </motion.p>
      </section>

      {/* PRICING GRID */}
      <section className="mt-28 px-10 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <PriceCard
          plan="Basic"
          price="19"
          desc="Perfect for individuals & small businesses starting with automation."
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
          plan="Growth"
          price="49"
          highlight
          desc="Best choice for businesses that want consistent growth & output."
          features={[
            "Everything in Basic",
            "Unlimited generations",
            "Full project history",
            "Multiple variations",
            "AI scheduling & strategy tips",
            "Faster processing",
            "Priority support",
          ]}
          current={user?.subscription_plan === "growth"}
          onChoose={() => handleSubscribe("growth")}
        />

        <PriceCard
          plan="Pro"
          price="99"
          desc="For serious creators & businesses that want maximum power."
          features={[
            "Everything in Growth",
            "AI image generation",
            "Long-form blog & article writer",
            "Campaign bundles",
            "Advanced automation tools",
            "Highest priority queue",
          ]}
          current={user?.subscription_plan === "pro"}
          onChoose={() => handleSubscribe("pro")}
        />
      </section>

      {/* GUARANTEE */}
      <section className="mt-24 px-10 max-w-4xl mx-auto text-center">
        <div className="border rounded-3xl p-10 shadow-sm bg-white">
          <h3 className="text-2xl font-bold">Your Business. Your Pace.</h3>
          <p className="text-gray-600 mt-3 text-lg">
            Upgrade, downgrade, or cancel anytime.  
            You stay in control — always.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-28 px-10 max-w-5xl mx-auto pb-28">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <Faq q="Do I need a credit card to start?"
               a="Yes — since this is a premium platform, subscriptions are handled securely through Stripe and can be cancelled anytime." />

          <Faq q="Can I cancel anytime?"
               a="Absolutely. You are never locked in. Cancel, upgrade or downgrade whenever you want." />

          <Faq q="What happens if I upgrade?"
               a="Your account instantly unlocks new features, faster generation speeds and higher limits." />

          <Faq q="Is my data secure?"
               a="Yes. Your content, prompts and account information stay private and secure." />
        </div>
      </section>

      {/* CTA FOR LOGGED OUT USERS */}
      {!isLoggedIn && (
        <div className="text-center pb-20">
          <h2 className="text-3xl font-bold">
            Ready to put your business on Autopilot?
          </h2>
          <p className="text-gray-600 mt-3">
            Join the next generation of AI-powered businesses today.
          </p>

          <a
            href="/register"
            className="inline-block mt-8 px-10 py-4 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition"
          >
            Get Started
          </a>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-gray-500">
        © 2025 AutopilotAI. All rights reserved.
      </footer>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

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
      className={`p-10 rounded-3xl border text-center bg-white shadow-sm ${
        highlight ? "border-black shadow-xl scale-[1.03]" : "border-gray-200"
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

function Faq({ q, a }: any) {
  return (
    <div className="border rounded-2xl p-6 bg-white">
      <h4 className="text-lg font-bold">{q}</h4>
      <p className="text-gray-600 mt-2">{a}</p>
    </div>
  );
}
