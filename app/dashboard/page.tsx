"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

/* =========================
   QUOTES
   ========================= */
const QUOTES = [
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    text: "He who controls the narrative controls the people.",
    author: "Niccolò Machiavelli",
  },
  {
    text: "Waste no more time arguing what a good man should be. Be one.",
    author: "Marcus Aurelius",
  },
  {
    text: "Fortune favors the bold.",
    author: "Latin Proverb",
  },
  {
    text: "A man who does not plan long ahead will find trouble at his door.",
    author: "Confucius",
  },
];

/* =========================
   AI DAILY FOCUS
   ========================= */
const AI_DAILY_FOCUS = [
  {
    title: "Increase outbound visibility",
    tasks: [
      "Publish one short-form post",
      "Draft a follow-up email",
      "Review yesterday’s engagement",
    ],
  },
  {
    title: "Improve lead conversion",
    tasks: [
      "Refine your email CTA",
      "Create one new ad variation",
      "Audit landing page clarity",
    ],
  },
  {
    title: "Build long-term authority",
    tasks: [
      "Outline a blog post",
      "Repurpose older content",
      "Plan next week’s topics",
    ],
  },
  {
    title: "Strengthen brand consistency",
    tasks: [
      "Review tone across emails",
      "Update one ad headline",
      "Align content with brand promise",
    ],
  },
];

/* =========================
   HELPERS
   ========================= */
function getDailyItem<T>(list: T[]) {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash += today.charCodeAt(i);
  return list[hash % list.length];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning.";
  if (hour >= 12 && hour < 18) return "Good afternoon.";
  if (hour >= 18 && hour < 23) return "Good evening.";
  return "Welcome back.";
}

export default function Dashboard() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const quote = getDailyItem(QUOTES);
  const aiFocus = getDailyItem(AI_DAILY_FOCUS);
  const greeting = getGreeting();

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubscriptionPlan(res.data.subscription));
  }, [router]);

  const isSubscriber = subscriptionPlan && subscriptionPlan !== "free";

  return (
    <div className="min-h-screen bg-white px-14 py-12 text-black overflow-hidden">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center relative z-20">
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold tracking-tight"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </motion.h1>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300
                       flex items-center justify-center text-sm font-semibold text-gray-700"
          >
            U
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 animate-pulse opacity-40" />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="absolute right-0 mt-4 w-64 rounded-3xl
                           bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
              >
                <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-white">
                  <p className="text-xs uppercase text-gray-500">Current plan</p>
                  <p className="text-lg font-semibold capitalize text-amber-600">
                    {subscriptionPlan}
                  </p>
                </div>

                <MenuItem label="Profile" onClick={() => router.push("/dashboard/profile")} />
                <MenuItem label="My Work" onClick={() => router.push("/dashboard/work")} />
                <MenuItem label="Subscription" onClick={() => router.push("/pricing")} />
                <MenuItem
                  label="Log out"
                  danger
                  onClick={() => {
                    localStorage.removeItem("autopilot_token");
                    router.push("/login");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <motion.section className="mt-28 max-w-4xl">
        <h2 className="text-5xl font-bold">{greeting}</h2>
        <p className="text-xl text-gray-600 mt-4">
          Your business is already moving forward.
        </p>

        <blockquote className="mt-10 pl-6 border-l-2 border-amber-300 italic text-lg text-gray-700">
          “{quote.text}”
          <span className="block mt-4 text-sm not-italic text-amber-600">
            — {quote.author}
          </span>
        </blockquote>
      </motion.section>

      {/* ================= ACTIONS ================= */}
      <motion.section className="mt-32">
        <h3 className="text-3xl font-semibold mb-10">
          What should AI handle next?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <ActionCard title="Generate content" onClick={() => router.push("/dashboard/content")} />
          <ActionCard title="Write emails" onClick={() => router.push("/dashboard/email")} />
          <ActionCard title="Create ads" onClick={() => router.push("/dashboard/ads")} />
          <ActionCard title="My Work" onClick={() => router.push("/dashboard/work")} />
        </div>
      </motion.section>

      {/* ================= AI FOCUS ================= */}
      <motion.section className="mt-40 max-w-3xl">
        <h3 className="text-3xl font-semibold mb-6">
          AI Focus for Today
        </h3>

        <div
          className={`rounded-3xl p-10 border shadow-sm ${
            isSubscriber
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200 bg-gray-100 opacity-60"
          }`}
        >
          <p className="text-2xl font-semibold mb-4">
            {isSubscriber ? aiFocus.title : "Upgrade required"}
          </p>

          {isSubscriber ? (
            <ul className="space-y-3 text-gray-700">
              {aiFocus.tasks.map((task, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {task}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              Daily AI guidance is available on paid plans.
            </p>
          )}

          <p className="mt-6 text-xs text-gray-500">
            Updated daily · Calm guidance, not noise
          </p>
        </div>
      </motion.section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-6 py-4 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-700"
      } hover:bg-gray-100`}
    >
      {label}
    </motion.button>
  );
}

function ActionCard({ title, onClick }: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl
                 hover:border-amber-300 border border-transparent"
    >
      <h4 className="text-2xl font-semibold">{title}</h4>
    </motion.div>
  );
}
