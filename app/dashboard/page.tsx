"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

/* =========================
   QUOTES & DAILY FOCUS
========================= */
const QUOTES = [
  { text: "Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The work is the reward.", author: "Unknown" },
  { text: "Progress is built on consistent execution.", author: "AutopilotAI" },
  { text: "Focus on the system, not the goal.", author: "James Clear" },
  { text: "Clarity precedes mastery.", author: "Robin Sharma" },
];

const AI_DAILY_FOCUS = [
  {
    title: "Strengthen Visibility",
    subtitle: "Increase reach through consistent, high-value output",
    tasks: [
      "Publish one piece of core content",
      "Engage with key audience members",
      "Share strategic insights",
    ],
  },
  {
    title: "Accelerate Conversion",
    subtitle: "Move prospects closer to commitment",
    tasks: [
      "Refine primary offer messaging",
      "Follow up on warm opportunities",
      "Test a new acquisition angle",
    ],
  },
  {
    title: "Deepen Authority",
    subtitle: "Establish long-term influence in your space",
    tasks: [
      "Develop one in-depth piece",
      "Repurpose existing high-performers",
      "Plan upcoming themes",
    ],
  },
  {
    title: "Refine Communication",
    subtitle: "Ensure every message aligns with your brand",
    tasks: [
      "Review recent content for consistency",
      "Update key templates",
      "Clarify core positioning",
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
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
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

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) {
          setInitial(res.data.name.charAt(0).toUpperCase());
          setFullName(res.data.name.split(" ")[0] || res.data.name);
        }
        if (res.data?.subscription)
          setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });

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
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">

      {/* Cinematic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Your tools are ready. Let’s work.
          </p>
        </motion.section>

        {/* Usage */}
        {limit !== null && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Monthly Generations
                </p>
                <p className="text-3xl font-semibold mt-2">
                  {usageLoading
                    ? "—"
                    : limit === null
                    ? "Unlimited"
                    : `${used ?? 0} of ${limit} used`}
                </p>
              </div>

              <div className="w-full max-w-md">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d]"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-400 text-right">
                  {remaining !== null ? `${remaining} remaining` : "No limits"}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Tools */}
        <section className="mb-20">
          <h2 className="text-3xl font-medium mb-10">Tools</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              title="Generate Content"
              description="Posts, threads, and narratives"
              href="/dashboard/content"
            />
            <ToolCard
              title="Write Emails & Replies"
              description="Outreach and communication"
              href="/dashboard/email"
            />
            <ToolCard
              title="Create Ads"
              description="High-conversion ad copy"
              href="/dashboard/ads"
            />
            <ToolCard
              title="My Work"
              description="All generated content"
              href="/dashboard/work"
            />
          </div>
        </section>

        {/* Focus + Plan */}
        <section className="grid gap-10 md:grid-cols-2 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
              Today’s Focus
            </p>

            <h3 className="text-2xl font-semibold mb-3">{focus.title}</h3>
            <p className="text-gray-300 mb-8">{focus.subtitle}</p>

            <ul className="space-y-4">
              {focus.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#2b4e8d] mt-2" />
                  <span className="text-gray-200">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-2xl border border-[#2b4e8d]/60 bg-gradient-to-br from-[#111b2d] to-[#1b2f54] text-white p-10 shadow-[0_50px_120px_rgba(0,0,0,.6)] flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-wide opacity-80 mb-4">
                Current Plan
              </p>

              <h3 className="text-3xl font-semibold mb-6">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() +
                    subscriptionPlan.slice(1)
                  : "Free"}
              </h3>

              <p className="opacity-90">
                Upgrade for unlimited generations and priority processing.
              </p>
            </div>

            <button
              onClick={() => router.push("/upgrade")}
              className="mt-10 py-4 bg-white text-[#1b2f54] rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Upgrade Plan
            </button>
          </motion.div>
        </section>

        {/* Quote */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center py-16 border-t border-white/10"
        >
          <p className="text-2xl md:text-3xl font-light italic text-gray-300 max-w-4xl mx-auto leading-relaxed">
            “{quote.text}”
          </p>
          <p className="mt-6 text-lg text-[#6d8ce8] font-medium">
            — {quote.author}
          </p>
        </motion.section>

        {/* Contact */}
        <footer className="text-center py-12 border-t border-white/10 text-gray-400">
          Questions? Email{" "}
          <a
            href="mailto:contact@autopilotai.dev"
            className="text-[#6d8ce8] hover:underline"
          >
            contact@autopilotai.dev
          </a>
        </footer>
      </main>
    </div>
  );
}

/* TOOL CARD */
function ToolCard({
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
      whileHover={{ y: -4 }}
      onClick={() => router.push(href)}
      className="text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_40px_100px_rgba(0,0,0,.55)] hover:border-[#2b4e8d] transition-all group"
    >
      <h3 className="text-xl font-semibold mb-3 group-hover:text-[#6d8ce8] transition">
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>

      <span className="mt-6 inline-block text-sm font-medium text-[#6d8ce8] opacity-0 group-hover:opacity-100 transition">
        Open →
      </span>
    </motion.button>
  );
}
