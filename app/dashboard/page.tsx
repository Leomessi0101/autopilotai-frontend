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
   ACTIVITY FEED
   ========================= */
const ACTIVITY_FEED = [
  {
    type: "Content",
    label: "Generated 5 social posts",
    time: "2 min ago",
  },
  {
    type: "Email",
    label: "Drafted 3 follow-up emails",
    time: "15 min ago",
  },
  {
    type: "Ads",
    label: "Created 2 new ad variations",
    time: "42 min ago",
  },
  {
    type: "System",
    label: "Usage synced successfully",
    time: "1 hr ago",
  },
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
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      const data = res.data || {};

      // makes it bulletproof so it works no matter backend shape
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

  const isSubscriber = !!subscriptionPlan;
  const progress =
    limit !== null && used !== null ? Math.min(100, (used / limit) * 100) : 0;

  const bgClass = darkMode ? "bg-black text-white" : "bg-white text-black";
  const cardBase = "rounded-3xl border shadow-sm transition";
  const cardLight = "border-gray-200 bg-white";
  const cardDark = "border-white/10 bg-white/5";

  return (
    <div className={`min-h-screen ${bgClass} flex`}>
      {/* LEFT SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col w-64 border-r ${
          darkMode ? "border-white/10 bg-black" : "border-gray-200 bg-white"
        } py-8 px-6`}
      >
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-12 space-y-4 text-sm font-medium">
          <SidebarItem label="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem label="Generate Content" onClick={() => router.push("/dashboard/content")} />
          <SidebarItem label="Write Emails" onClick={() => router.push("/dashboard/email")} />
          <SidebarItem label="Create Ads" onClick={() => router.push("/dashboard/ads")} />
          <SidebarItem label="My Work" onClick={() => router.push("/dashboard/work")} />
          <SidebarItem label="Billing" onClick={() => router.push("/billing")} />
          <SidebarItem label="Pricing Plans" onClick={() => router.push("/pricing")} />

          <button
            onClick={() => {
              localStorage.removeItem("autopilot_token");
              router.push("/login");
            }}
            className="text-red-500 hover:underline mt-6"
          >
            Logout
          </button>
        </nav>

        <div className="mt-auto pt-6 text-xs text-gray-500">
          <p>Tip: Refresh dashboard after upgrading plan.</p>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-6 md:px-16 py-10 overflow-y-auto relative">
        {/* Top bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-xs">
            <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Interface</span>
            <button
              onClick={() => setDarkMode((v) => !v)}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                darkMode
                  ? "border-white/20 bg-white/5 text-gray-100"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              {darkMode ? "Dark mode" : "Light mode"}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300
              flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm"
          >
            {name}
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
          </motion.button>
        </div>

        {/* PROFILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/20"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.aside
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`fixed top-20 right-6 w-80 rounded-3xl ${
                  darkMode ? "bg-black/95 border-white/10" : "bg-white/95 border-gray-200"
                } backdrop-blur-xl border shadow-2xl z-30 overflow-hidden`}
              >
                <div
                  className={`relative px-6 pt-6 pb-4 border-b ${
                    darkMode ? "border-white/10 bg-white/5" : "border-gray-100 bg-amber-50"
                  }`}
                >
                  <button
                    onClick={() => setMenuOpen(false)}
                    className={`absolute right-4 top-4 text-sm ${
                      darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                      {name}
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500">Plan</p>
                      <p className="font-bold capitalize">{subscriptionPlan ?? "Free"}</p>
                    </div>
                  </div>

                  {limit !== null && used !== null && (
                    <div className="mt-5">
                      <p className="text-xs text-gray-500 mb-1">
                        Usage: {used} / {limit}
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="py-2">
                  <MenuItem label="Profile" onClick={() => router.push("/dashboard/profile")} />
                  <MenuItem label="My Work" onClick={() => router.push("/dashboard/work")} />
                  <MenuItem label="Billing" onClick={() => router.push("/billing")} />
                  <MenuItem label="Subscription Plans" onClick={() => router.push("/pricing")} />

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
            </>
          )}
        </AnimatePresence>

        {/* GREETING */}
        <motion.section className="mt-10 max-w-4xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-5xl font-bold">{greeting}</h2>
          <p className="text-xl text-gray-500 mt-4">Your business is already moving forward.</p>

          <blockquote
            className={`mt-10 pl-6 border-l-2 border-amber-300 italic text-lg ${
              darkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            “{quote.text}”
            <span
              className={`block mt-4 text-sm not-italic ${
                darkMode ? "text-amber-300" : "text-amber-600"
              }`}
            >
              — {quote.author}
            </span>
          </blockquote>
        </motion.section>

        {/* METRICS */}
        <motion.section
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MetricCard title="Plan" value={subscriptionPlan ?? "Free"} highlight darkMode={darkMode} />
          <MetricCard title="Usage" value={limit === null ? "Unlimited" : `${used ?? 0} / ${limit}`} darkMode={darkMode} />
          <MetricCard title="Remaining" value={limit === null ? "∞" : `${(limit ?? 0) - (used ?? 0)}`} darkMode={darkMode} />
        </motion.section>

        {/* ACTIONS */}
        <motion.section
          className="mt-28"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-3xl font-semibold mb-10">
            What should AI handle next?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <ActionCard title="Generate Content" onClick={() => router.push("/dashboard/content")} darkMode={darkMode} />
            <ActionCard title="Write Emails" onClick={() => router.push("/dashboard/email")} darkMode={darkMode} />
            <ActionCard title="Create Ads" onClick={() => router.push("/dashboard/ads")} darkMode={darkMode} />
            <ActionCard title="My Work" onClick={() => router.push("/dashboard/work")} darkMode={darkMode} />
          </div>
        </motion.section>

        {/* USAGE */}
        <motion.section
          className="mt-32 max-w-3xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-semibold mb 4">Your usage</h3>

          {limit === null ? (
            <div className={`${cardBase} ${darkMode ? "border-amber-400/50 bg-amber-500/10" : "border-amber-300 bg-amber-50"} p-6`}>
              <p className={`text-lg font-semibold ${darkMode ? "text-amber-200" : "text-amber-600"}`}>
                Unlimited generations
              </p>
              <p className="text-sm text-gray-500 mt-1">
                You’re on a premium plan.
              </p>
            </div>
          ) : (
            <div className={`${cardBase} ${darkMode ? cardDark : cardLight} p-6`}>
              <div className="flex justify-between text-sm mb-2">
                <span>{used} / {limit} used</span>
                <span className="text-gray-500">{limit - (used ?? 0)} remaining</span>
              </div>

              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} className="h-full bg-amber-500" />
              </div>
            </div>
          )}
        </motion.section>

        {/* ACTIVITY */}
        <motion.section
          className="mt-32 max-w-4xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Recent activity</h3>
          <div className={`${cardBase} ${darkMode ? cardDark : cardLight} p-5`}>
            <ul className="space-y-3 text-sm">
              {ACTIVITY_FEED.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full text-left py-2 hover:translate-x-1 transition text-sm">
      {label}
    </button>
  );
}

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button whileHover={{ x: 6 }} onClick={onClick} className={`w-full px-6 py-3 text-left text-sm ${danger ? "text-red-500" : "text-gray-700"} hover:bg-gray-100`}>
      {label}
    </motion.button>
  );
}

function ActionCard({ title, onClick, darkMode }: any) {
  return (
    <motion.div whileHover={{ y: -8 }} onClick={onClick} className={`cursor-pointer rounded-3xl p-10 shadow-sm hover:shadow-2xl hover:border-amber-300 border border-transparent transition ${darkMode ? "bg-white/5" : "bg-white"}`}>
      <h4 className="text-2xl font-semibold">{title}</h4>
    </motion.div>
  );
}

function MetricCard({ title, value, highlight = false, darkMode }: any) {
  const base = "rounded-3xl p-6 border shadow-sm transition";
  const light = highlight ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-white";
  const dark = highlight ? "border-amber-400/60 bg-amber-500/10" : "border-white/10 bg-white/5";

  return (
    <motion.div whileHover={{ y: -4 }} className={`${base} ${darkMode ? dark : light}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}
