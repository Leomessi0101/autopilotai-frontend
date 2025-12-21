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
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<string | null>(null);

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

    // Usage (bulletproof against slightly different backend keys)
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
      {/* TOP NAVBAR (shared) */}
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-6xl mx-auto px-6 md:px-8 lg:px-0 py-10 md:py-14">
        {/* GREETING + QUOTE */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {greeting}
              {fullName ? `, ${fullName}.` : "."}
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-xl">
              Your AI is ready to write, reply and generate while you focus on
              actually running the business.
            </p>
          </div>

          <div className="md:max-w-sm w-full">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Today&apos;s quote
              </p>
              <p className="italic text-gray-800 text-sm leading-relaxed">
                “{quote.text}”
              </p>
              <p className="mt-3 text-xs font-semibold text-amber-600">
                — {quote.author}
              </p>
            </div>
          </div>
        </motion.section>

        {/* TOP GRID: USAGE + PLAN + SHORTCUTS */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Usage card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="md:col-span-2 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Usage this month
                </p>
                <h2 className="text-xl font-semibold mt-1">
                  Content, emails & ads generated
                </h2>
              </div>
            </div>

            {usageLoading ? (
              <div className="mt-6 h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gray-300 animate-pulse" />
              </div>
            ) : limit === null ? (
              <div>
                <p className="text-lg font-semibold text-amber-600">
                  Unlimited generations
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  You&apos;re on a plan without a hard monthly cap. Use it.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    {used ?? 0} / {limit} used
                  </span>
                  <span>
                    {remaining !== null ? `${remaining} remaining` : ""}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-amber-500"
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Usage resets automatically every month based on your plan.
                </p>
              </>
            )}
          </motion.div>

          {/* Plan card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Current plan
              </p>
              <h2 className="text-2xl font-bold mt-1">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() +
                    subscriptionPlan.slice(1)
                  : "Free"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Upgrade to unlock unlimited generations and faster queues.
              </p>
            </div>

            <button
              onClick={() => router.push("/pricing")}
              className="mt-5 w-full px-5 py-2.5 rounded-full border border-black text-sm font-medium hover:bg-black hover:text-white transition"
            >
              View plans
            </button>
          </motion.div>
        </section>

        {/* QUICK ACTIONS */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">What do you want AI to do?</h2>
            <p className="text-xs text-gray-500">
              Everything you generate is saved automatically in{" "}
              <span className="font-medium">My Work</span>.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <ActionCard
              title="Generate content"
              line="Social posts, hooks, ideas."
              onClick={() => router.push("/dashboard/content")}
            />
            <ActionCard
              title="Write emails"
              line="Cold, follow-ups & replies."
              onClick={() => router.push("/dashboard/email")}
            />
            <ActionCard
              title="Create ads"
              line="Meta, Google, TikTok angles."
              onClick={() => router.push("/dashboard/ads")}
            />
            <ActionCard
              title="Open my work"
              line="See everything AI created."
              onClick={() => router.push("/dashboard/work")}
            />
          </div>
        </motion.section>

        {/* DAILY FOCUS + ACTIVITY */}
        <section className="mt-16 grid gap-6 md:grid-cols-[1.4fr,1.2fr] pb-20">
          {/* AI Focus */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              AI focus for today
            </p>
            <h3 className="text-xl font-semibold mb-2">{focus.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use these as simple prompts inside the tools and keep momentum.
            </p>

            <ul className="space-y-2 text-sm text-gray-800">
              {focus.tasks.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Recent activity (dummy, but feels alive) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Recent activity
            </p>
            <h3 className="text-xl font-semibold mb-4">
              How you&apos;ve been using AutopilotAI
            </h3>

            <ul className="space-y-3 text-sm">
              <ActivityRow
                label="Generated social content"
                type="Content"
                time="Today"
              />
              <ActivityRow
                label="Drafted outreach emails"
                type="Email"
                time="Yesterday"
              />
              <ActivityRow
                label="Created new ad angles"
                type="Ads"
                time="This week"
              />
            </ul>

            <button
              onClick={() => router.push("/dashboard/work")}
              className="mt-6 text-xs text-gray-500 hover:text-black underline underline-offset-4"
            >
              Open My Work →
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

/* =========================
   COMPONENTS
   ========================= */

function ActionCard({
  title,
  line,
  onClick,
}: {
  title: string;
  line: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className="text-left rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer"
    >
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Tool
      </p>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{line}</p>
      <span className="mt-4 inline-block text-xs font-medium text-amber-600">
        Open →
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
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{type}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </li>
  );
}
