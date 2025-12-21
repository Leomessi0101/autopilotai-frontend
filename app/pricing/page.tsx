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
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("autopilot-theme", newTheme);
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
      className={`min-h-screen flex transition-all duration-500 ${
        isDark ? "bg-[#0B0B0E] text-white" : "bg-white text-black"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col w-64 px-6 py-8 border-r ${
          isDark
            ? "bg-[#0F0F14] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <h1
          onClick={() => (window.location.href = "/")}
          className="text-2xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-12 space-y-4 text-sm">
          <SidebarItem label="Dashboard" href="/dashboard" />
          <SidebarItem label="Generate Content" href="/dashboard/content" />
          <SidebarItem label="Write Emails" href="/dashboard/email" />
          <SidebarItem label="Create Ads" href="/dashboard/ads" />
          <SidebarItem label="My Work" href="/dashboard/work" />
          <SidebarItem label="Billing" href="/billing" />
        </nav>

        <div className="mt-auto pt-10 text-xs text-gray-500">
          Secure payments powered by Stripe.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div
          className={`w-full py-6 px-6 md:px-10 border-b sticky top-0 backdrop-blur-xl z-50 flex justify-between items-center ${
            isDark
              ? "border-gray-800 bg-[#0B0B0E]/80"
              : "border-gray-200 bg-white/80"
          }`}
        >
          <h2 className="text-xl font-semibold tracking-tight">
            Pricing Plans
          </h2>

          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              isDark
                ? "border-gray-700 hover:border-amber-500"
                : "border-gray-300 hover:border-black"
            }`}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        {/* HERO */}
        <section className="px-8 md:px-20 pt-20 text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
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

          {!isLoggedIn && (
            <div className="mt-8">
              <a
                href="/register"
                className={`px-8 py-3 rounded-full text-white hover:opacity-90 transition shadow-xl ${
                  isDark ? "bg-amber-500" : "bg-black"
                }`}
              >
                Get Started Free
              </a>
            </div>
          )}
        </section>

        {/* PRICING CARDS */}
        <section className="mt-24 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <PriceCard
            theme={theme}
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
            theme={theme}
            plan="Growth"
            price="49"
            highlight
            desc="The best plan for real momentum and serious growth."
            features={[
              "Everything in Basic",
              "Unlimited generations",
              "Full project history",
              "Multiple variations per request",
              "AI scheduling & strategy tips",
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
            desc="For serious businesses & creators who want maximum output."
            features={[
              "Everything in Growth",
              "AI image generation",
              "Long-form blog & article writer",
              "Complete campaign bundles",
              "Advanced automation tools",
              "Highest priority queue",
            ]}
            current={user?.subscription_plan === "pro"}
            onChoose={() => handleSubscribe("pro")}
          />
        </section>

        {/* GUARANTEE */}
        <section className="mt-28 px-6 md:px-10 max-w-4xl mx-auto text-center">
          <div
            className={`border rounded-3xl p-10 shadow-xl ${
              isDark
                ? "bg-[#0F0F14] border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-3xl font-bold">
              Built For Growth — Not Lock-In
            </h3>
            <p
              className={`mt-3 text-lg leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Upgrade, downgrade, pause, or cancel anytime.
              No contracts. No stress. Just real business results.
            </p>
          </div>
        </section>

        {/* COMPARE TABLE */}
        <section className="mt-32 px-6 md:px-10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Compare Plans
          </h2>

          <div
            className={`overflow-x-auto rounded-3xl border shadow-xl ${
              isDark
                ? "border-gray-800 bg-[#0F0F14]"
                : "border-gray-200 bg-white"
            }`}
          >
            <table className="w-full text-sm">
              <thead
                className={isDark ? "bg-[#13131A]" : "bg-gray-50"}
              >
                <tr>
                  <th className="text-left py-4 px-6">Feature</th>
                  <th className="text-center">Basic</th>
                  <th className="text-center text-amber-500 font-semibold">
                    Growth ⭐
                  </th>
                  <th className="text-center">Pro</th>
                </tr>
              </thead>

              <tbody className="divide-y dark:divide-gray-800">
                {[
                  ["Unlimited generations", "—", "✓", "✓"],
                  ["Fast processing", "—", "✓", "✓"],
                  ["Priority queue", "—", "—", "✓"],
                  ["AI scheduling + strategy", "—", "✓", "✓"],
                  ["Campaign bundles", "—", "—", "✓"],
                  ["Project saving", "✓", "✓", "✓"],
                ].map((row, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="text-left py-4 px-6 font-medium">
                      {row[0]}
                    </td>
                    <td>{row[1]}</td>
                    <td className="text-amber-500 font-semibold">
                      {row[2]}
                    </td>
                    <td>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-32 px-6 md:px-10 max-w-5xl mx-auto pb-28">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Faq
              theme={theme}
              q="Do I need a credit card to subscribe?"
              a="Yes. Payments are handled securely through Stripe and you can cancel anytime."
            />
            <Faq
              theme={theme}
              q="What happens if I upgrade?"
              a="Your account instantly unlocks the new plan features without interruption."
            />
            <Faq
              theme={theme}
              q="Can I cancel whenever I want?"
              a="Yes — there are no contracts, commitments or hidden penalties."
            />
            <Faq
              theme={theme}
              q="Is my data secure?"
              a="Absolutely. Your content, prompts and account information remain private."
            />
          </div>
        </section>

        {/* CTA */}
        {!isLoggedIn && (
          <div className="text-center pb-20 px-6">
            <h2 className="text-3xl font-bold">
              Ready to put your business on Autopilot?
            </h2>
            <p
              className={`mt-3 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Join forward-thinking businesses using AI to scale faster.
            </p>

            <a
              href="/register"
              className={`inline-block mt-8 px-10 py-4 rounded-full text-lg text-white hover:opacity-90 transition shadow-xl ${
                isDark ? "bg-amber-500" : "bg-black"
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
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ label, href }: any) {
  return (
    <a href={href} className="block w-full py-2 hover:translate-x-1 transition">
      {label}
    </a>
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

function Faq({ q, a, theme }: any) {
  const isDark = theme === "dark";
  return (
    <div
      className={`border rounded-2xl p-6 shadow ${
        isDark
          ? "bg-[#0F0F14] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <h4 className="text-lg font-bold">{q}</h4>
      <p className={isDark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
        {a}
      </p>
    </div>
  );
}
