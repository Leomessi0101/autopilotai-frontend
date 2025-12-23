"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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
  { text: "Fortune favors the bold.", author: "Latin Proverb" },
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
      "Send one outreach email",
      "Reply to yesterday’s messages",
    ],
  },
  {
    title: "Improve lead conversion",
    tasks: [
      "Refine your main offer line",
      "Create one new ad variation",
      "Follow up with warm leads",
    ],
  },
  {
    title: "Build long-term authority",
    tasks: [
      "Outline a valuable long-form post",
      "Repurpose one old piece of content",
      "Plan topics for the next 3 days",
    ],
  },
  {
    title: "Strengthen brand consistency",
    tasks: [
      "Check tone across last 3 posts",
      "Update one email template",
      "Align copy with your core promise",
    ],
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
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 23) return "Good evening";
  return "Welcome back";
}

export default function DashboardPage() {
  const router = useRouter();

  const [initial, setInitial] = useState("U");
  const [fullName, setFullName] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [used, setUsed] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);

  const [usageLoading, setUsageLoading] = useState(true);

  const quote = getDailyItem(QUOTES);
  const focus = getDailyItem(AI_DAILY_FOCUS);
  const greeting = getGreeting();

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Auth / profile
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) {
          setInitial(res.data.name.charAt(0).toUpperCase());
          setFullName(res.data.name.split(" ")[0] || res.data.name);
        }
        if (res.data?.subscription) {
          setSubscriptionPlan(res.data.subscription);
        }
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

    // Usage
    api
      .get("/api/auth/usage")
      .then((res) => {
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
      })
      .finally(() => setUsageLoading(false));
  }, [router]);

  const progress =
    used !== null && limit !== null && limit > 0
      ? Math.min(100, (used / limit) * 100)
      : 0;

  const remaining =
    used !== null && limit !== null ? Math.max(0, limit - used) : null;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Dashboard Navbar */}
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* GREETING + QUOTE */}
        <section className="grid gap-10 md:grid-cols-[1fr,380px] items-start mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {greeting}
              {fullName ? `, ${fullName}.` : "."}
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed">
              Your AI is ready to write content, reply to leads, and run ads —
              while you focus on building the business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
          >
            <p className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">
              Today&apos;s mindset
            </p>
            <p className="text-lg italic text-gray-800 leading-relaxed">
              “{quote.text}”
            </p>
            <p className="mt-5 text-sm font-semibold text-amber-600">
              — {quote.author}
            </p>
          </motion.div>
        </section>

        {/* USAGE + PLAN CARD */}
        <section className="grid gap-8 md:grid-cols-3 mb-20">
          {/* Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-2 rounded-3xl border border-gray-200 bg-white p-10 shadow-xl"
          >
            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">
              Monthly usage
            </h3>
            <p className="text-3xl font-extrabold mb-8">
              {usageLoading ? "Loading…" : limit === null ? "Unlimited" : `${used ?? 0} of ${limit} generations used`}
            </p>

            {usageLoading ? (
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-gray-300 animate-pulse" />
              </div>
            ) : limit === null ? (
              <div className="text-lg font-semibold text-amber-600">
                No limits — generate as much as you want.
              </div>
            ) : (
              <>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-amber-500"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{remaining} remaining</span>
                  <span>Resets monthly</span>
                </div>
              </>
            )}
          </motion.div>

          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl flex flex-col justify-between"
          >
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">
                Current plan
              </p>
              <h3 className="text-3xl font-extrabold">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                  : "Free"}
              </h3>
              <p className="mt-4 text-gray-600">
                Upgrade for unlimited generations, priority processing, and advanced tools.
              </p>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-8 w-full py-4 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition shadow-lg hover:shadow-xl"
            >
              Upgrade Plan
            </button>
          </motion.div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              What do you want AI to do today?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <ActionCard
              title="Generate Content"
              description="Social posts, hooks, threads, captions"
              href="/dashboard/content"
            />
            <ActionCard
              title="Write Emails & Replies"
              description="Cold outreach, follow-ups, smart responses"
              href="/dashboard/email"
            />
            <ActionCard
              title="Create Ads"
              description="Meta, Google, TikTok — copy + angles"
              href="/dashboard/ads"
            />
            <ActionCard
              title="My Work"
              description="All generated content, history & exports"
              href="/dashboard/work"
            />
          </div>
        </section>

        {/* AI FOCUS + RECENT ACTIVITY */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* AI Daily Focus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl"
          >
            <p className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">
              AI Recommended Focus
            </p>
            <h3 className="text-2xl font-extrabold mb-4">{focus.title}</h3>
            <p className="text-gray-600 mb-6">
              Simple, high-leverage actions to keep momentum going.
            </p>
            <ul className="space-y-4">
              {focus.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-1 w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-gray-700">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl"
          >
            <p className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">
              Recent Activity
            </p>
            <h3 className="text-2xl font-extrabold mb-6">
              You&apos;ve been consistent
            </h3>
            <ul className="space-y-6">
              <ActivityRow label="Generated social content" type="Content" time="Today" />
              <ActivityRow label="Drafted outreach emails" type="Email" time="Yesterday" />
              <ActivityRow label="Created new ad variations" type="Ads" time="This week" />
            </ul>
            <button
              onClick={() => router.push("/dashboard/work")}
              className="mt-8 text-amber-600 font-medium hover:text-black transition flex items-center gap-2"
            >
              View all activity →
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

/* COMPONENTS */

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="text-left rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-xl hover:border-amber-500 hover:shadow-2xl transition-all cursor-pointer text-center group"
    >
      <h3 className="text-2xl font-extrabold mb-3 group-hover:text-amber-600 transition">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <span className="mt-6 inline-block text-lg font-semibold text-amber-600 group-hover:translate-x-2 transition-transform">
        →
      </span>
    </motion.button>
  );
}

function ActivityRow({
  label,
  type,
  time,
}: {
  label: string;
  type: string;
  time: string;
}) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <div>
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </li>
  );
}