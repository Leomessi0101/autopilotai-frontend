"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

/* ========================= QUOTES ========================= */
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

const ACTIVITY_FEED = [
  { type: "Content", label: "Generated 5 social posts", time: "2 min ago" },
  { type: "Email", label: "Drafted 3 follow-up emails", time: "15 min ago" },
  { type: "Ads", label: "Created 2 new ad variations", time: "42 min ago" },
  { type: "System", label: "Usage synced successfully", time: "1 hr ago" },
];

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [name, setName] = useState("U");

  const [used, setUsed] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);

  const quote = getDailyItem(QUOTES);
  const aiFocus = getDailyItem(AI_DAILY_FOCUS);
  const greeting = getGreeting();

  /* THEME PERSISTENCE */
  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("autopilot-theme", next);
  };

  const isDark = theme === "dark";

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
      const data = res.data || {};
      const usedValue =
        typeof data.used === "number"
          ? data.used
          : typeof data.used_generations === "number"
          ? data.used_generations
          : null;

      const limitValue =
        typeof data.limit === "number"
          ? data.limit
          : typeof data.monthly_limit === "number"
          ? data.monthly_limit
          : null;

      setUsed(usedValue);
      setLimit(limitValue);
    });
  }, [router]);

  const progress =
    limit !== null && used !== null ? Math.min(100, (used / limit) * 100) : 0;

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark ? "bg-[#0A0A0D] text-white" : "bg-white text-black"
      }`}
    >
      {/* ================= NAVBAR ================= */}
      <header
        className={`w-full py-6 px-6 md:px-12 flex justify-between items-center border-b sticky top-0 backdrop-blur-xl z-50 ${
          isDark ? "border-gray-800 bg-[#0A0A0D]/80" : "border-gray-200 bg-white/80"
        }`}
      >
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <div className="flex items-center gap-6 text-sm">
          <button onClick={() => router.push("/dashboard")} className="hover:underline">
            Dashboard
          </button>
          <button onClick={() => router.push("/pricing")} className="hover:underline">
            Upgrade
          </button>

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

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-sm font-semibold text-black shadow"
          >
            {name}
          </motion.button>
        </div>
      </header>

      {/* PROFILE PANEL */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
              className={`fixed top-24 right-6 w-80 rounded-3xl z-50 overflow-hidden border ${
                isDark ? "bg-[#0E0E12] border-gray-800" : "bg-white border-gray-200"
              } shadow-2xl`}
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Logged in</p>
                    <p className="text-lg font-bold capitalize">
                      {subscriptionPlan ?? "Free"}
                    </p>
                  </div>

                  <button onClick={() => setMenuOpen(false)}>✕</button>
                </div>
              </div>

              <div className="p-3">
                <MenuItem label="Profile" onClick={() => router.push("/dashboard/profile")} />
                <MenuItem label="My Work" onClick={() => router.push("/dashboard/work")} />
                <MenuItem label="Billing" onClick={() => router.push("/billing")} />
                <MenuItem label="Pricing" onClick={() => router.push("/pricing")} />

                <div className="border-t mt-3 pt-2">
                  <MenuItem
                    label="Logout"
                    danger
                    onClick={() => {
                      localStorage.removeItem("autopilot_token");
                      router.push("/login");
                    }}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      <div className="px-6 md:px-16 py-12">
        {/* Greeting */}
        <h2 className="text-4xl md:text-6xl font-bold">{greeting}</h2>
        <p className={isDark ? "text-gray-400 mt-4" : "text-gray-600 mt-4"}>
          Your AI assistant is ready. Let’s build something today.
        </p>

        {/* Quote */}
        <div
          className={`mt-10 p-8 rounded-3xl border ${
            isDark ? "border-gray-800 bg-[#0F0F14]" : "border-gray-200 bg-gray-50"
          }`}
        >
          <p className="italic text-lg">“{quote.text}”</p>
          <p className="mt-4 text-amber-500">— {quote.author}</p>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <MetricCard title="Plan" value={subscriptionPlan ?? "Free"} highlight theme={theme} />
          <MetricCard
            title="Usage"
            value={limit === null ? "Unlimited" : `${used ?? 0} / ${limit}`}
            theme={theme}
          />
          <MetricCard
            title="Remaining"
            value={limit === null ? "∞" : `${(limit ?? 0) - (used ?? 0)}`}
            theme={theme}
          />
        </div>

        {/* Actions */}
        <div className="mt-20">
          <h3 className="text-3xl font-semibold mb-10">Quick Actions</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <ActionCard title="Generate Content" onClick={() => router.push("/dashboard/content")} theme={theme} />
            <ActionCard title="Write Emails" onClick={() => router.push("/dashboard/email")} theme={theme} />
            <ActionCard title="Create Ads" onClick={() => router.push("/dashboard/ads")} theme={theme} />
            <ActionCard title="My Work" onClick={() => router.push("/dashboard/work")} theme={theme} />
          </div>
        </div>

        {/* Daily Focus */}
        <div className="mt-24 max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4">Focus for Today</h3>

          <div
            className={`p-8 rounded-3xl border ${
              isDark ? "border-gray-800 bg-[#0F0F14]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <h4 className="text-xl font-bold mb-5">{aiFocus.title}</h4>

            <ul className="space-y-3">
              {aiFocus.tasks.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Usage */}
        <div className="mt-24 max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4">Usage</h3>

          {limit === null ? (
            <div className="p-6 rounded-3xl border border-amber-400/50 bg-amber-500/10">
              <p className="text-lg font-semibold text-amber-300">
                Unlimited generations
              </p>
            </div>
          ) : (
            <div
              className={`p-6 rounded-3xl border ${
                isDark ? "border-gray-800 bg-[#0F0F14]" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex justify-between text-sm mb-3">
                <span>{used} / {limit} used</span>
                <span className="text-gray-500">
                  {limit - (used ?? 0)} remaining
                </span>
              </div>

              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Activity */}
        <div className="mt-24 max-w-4xl mb-20">
          <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>

          <div
            className={`p-6 rounded-3xl border ${
              isDark ? "border-gray-800 bg-[#0F0F14]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <ul className="space-y-4">
              {ACTIVITY_FEED.map((a, i) => (
                <li key={i} className="flex justify-between">
                  <div className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-medium">{a.label}</p>
                      <p className="text-xs text-gray-500">{a.type}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{a.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-4 py-3 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-400"
      } hover:bg-black/10`}
    >
      {label}
    </motion.button>
  );
}

function MetricCard({ title, value, highlight = false, theme }: any) {
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`p-8 rounded-3xl border shadow transition ${
        highlight
          ? "border-amber-400 bg-amber-500/10"
          : isDark
          ? "border-gray-800 bg-[#0F0F14]"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}

function ActionCard({ title, onClick, theme }: any) {
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={onClick}
      className={`
        cursor-pointer rounded-3xl p-10 shadow hover:shadow-2xl transition border
        ${
          isDark
            ? "border-gray-800 bg-[#0F0F14]"
            : "bg-white border-gray-200"
        }
      `}
    >
      <h4 className="text-2xl font-semibold">{title}</h4>
    </motion.div>
  );
}
