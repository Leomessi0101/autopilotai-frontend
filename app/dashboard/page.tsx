"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

/* =========================
   QUOTES
   ========================= */
const QUOTES = [
  {
    text:
      "You have power over your mind — not outside events. Realize this, and you will find strength.",
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
  { text: "Fortune favors the bold.", author: "Latin Proverb" },
  {
    text: "A man who does not plan long ahead will find trouble at his door.",
    author: "Confucius",
  },
];

/* =========================
   AI FOCUS
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
    tasks: ["Outline a blog post", "Repurpose older content", "Plan next week’s topics"],
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
  const [name, setName] = useState("U");

  const [used, setUsed] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);

  const quote = getDailyItem(QUOTES);
  const aiFocus = getDailyItem(AI_DAILY_FOCUS);
  const greeting = getGreeting();

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        setSubscriptionPlan(res.data.subscription);
        if (res.data.name) setName(res.data.name.charAt(0).toUpperCase());
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

    api.get("/api/auth/usage").then((res) => {
      setUsed(res.data.used);
      setLimit(res.data.limit);
    });
  }, [router]);

  const isSubscriber = !!subscriptionPlan;
  const progress =
    limit !== null && used !== null ? Math.min(100, (used / limit) * 100) : 0;

  return (
    <div className="min-h-screen bg-white px-6 md:px-12 py-8 text-black overflow-hidden">
      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center relative z-20">
        <motion.h1
          onClick={() => router.push("/")}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold tracking-tight cursor-pointer hover:opacity-70 transition"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </motion.h1>

        {/* Right side account area */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-xs">
            <span className="uppercase tracking-wide text-gray-500">Plan</span>
            <span className="font-semibold text-gray-800 capitalize">
              {subscriptionPlan ?? "Free"}
            </span>
            {limit !== null && used !== null && (
              <span className="text-gray-500">
                {used} / {limit} actions
              </span>
            )}
          </div>

          <button
            onClick={() => router.push("/pricing")}
            className="hidden md:inline-flex text-xs px-3 py-1.5 rounded-full border border-black/10 hover:border-black/40 hover:bg-black/5 transition"
          >
            Manage plan
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm border border-white"
          >
            {name}
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-30" />
          </motion.button>
        </div>
      </div>

      {/* ================= PROFILE PANEL ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed top-20 right-6 w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl z-30 overflow-hidden"
          >
            <div className="relative px-6 pt-6 pb-4 border-b bg-gradient-to-r from-amber-50 to-white">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  {name}
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800">AutopilotAI user</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Plan:{" "}
                    <span className="font-semibold capitalize">
                      {subscriptionPlan ?? "Free"}
                    </span>
                  </p>
                </div>
              </div>

              {limit !== null && used !== null && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Usage: {used} / {limit}
                  </p>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="py-2">
              <MenuItem
                label="Profile"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/profile");
                }}
              />
              <MenuItem
                label="My Work"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/work");
                }}
              />
              <MenuItem
                label="Billing"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/billing");
                }}
              />
              <MenuItem
                label="Subscription Plans"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/pricing");
                }}
              />

              <div className="border-t mt-2 pt-2">
                <MenuItem
                  label="Log out"
                  danger
                  onClick={() => {
                    localStorage.removeItem("autopilot_token");
                    router.push("/login");
                  }}
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ================= HERO ================= */}
      <motion.section
        className="mt-24 max-w-4xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      <motion.section
        className="mt-28"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h3 className="text-3xl font-semibold mb-10">
          What should AI handle next?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <ActionCard
            title="Generate Content"
            onClick={() => router.push("/dashboard/content")}
          />
          <ActionCard
            title="Write Emails"
            onClick={() => router.push("/dashboard/email")}
          />
          <ActionCard
            title="Create Ads"
            onClick={() => router.push("/dashboard/ads")}
          />
          <ActionCard
            title="My Work"
            onClick={() => router.push("/dashboard/work")}
          />
        </div>
      </motion.section>

      {/* ================= USAGE ================= */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mt-32 max-w-3xl"
      >
        <h3 className="text-2xl font-semibold mb-4">Your usage</h3>

        {limit === null ? (
          <div className="rounded-3xl p-6 border border-amber-300 bg-amber-50">
            <p className="text-lg font-semibold text-amber-600">
              Unlimited generations
            </p>
            <p className="text-sm text-gray-600 mt-1">You’re on a premium plan.</p>
          </div>
        ) : (
          <div className="rounded-3xl p-6 border border-gray-200 bg-white">
            <div className="flex justify-between text-sm mb-2">
              <span>
                {used} / {limit} used
              </span>
              <span className="text-gray-500">
                {limit - (used ?? 0)} remaining
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
                className="h-full bg-amber-500"
              />
            </div>
          </div>
        )}
      </motion.section>

      {/* ================= AI FOCUS ================= */}
      <motion.section
        className="mt-36 max-w-3xl pb-24"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-3xl font-semibold mb-6">AI Focus for Today</h3>

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
      className={`w-full px-6 py-3 text-left text-sm ${
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
      className="cursor-pointer bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl hover:border-amber-300 border border-transparent transition"
    >
      <h4 className="text-2xl font-semibold">{title}</h4>
    </motion.div>
  );
}
