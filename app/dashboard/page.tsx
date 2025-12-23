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
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
];

const AI_DAILY_FOCUS = [
  {
    title: "Amplify Your Reach",
    subtitle: "Expand your audience and influence today",
    tasks: ["Craft one viral-worthy post", "Engage with 10 key interactions", "Share behind-the-scenes value"],
  },
  {
    title: "Master Conversion",
    subtitle: "Turn interest into action and revenue",
    tasks: ["Optimize your primary call-to-action", "Launch a targeted ad test", "Nurture high-potential leads"],
  },
  {
    title: "Elevate Thought Leadership",
    subtitle: "Position yourself as the authority",
    tasks: ["Develop a deep-dive thread or article", "Curate and share insights", "Outline your content calendar"],
  },
  {
    title: "Refine Your Voice",
    subtitle: "Ensure every message resonates perfectly",
    tasks: ["Review recent communications for consistency", "Polish key templates", "Define your unique edge"],
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

    api.get("/api/auth/me").then((res) => {
      if (res.data?.name) {
        setInitial(res.data.name.charAt(0).toUpperCase());
        setFullName(res.data.name.split(" ")[0] || res.data.name);
      }
      if (res.data?.subscription) {
        setSubscriptionPlan(res.data.subscription);
      }
    }).catch(() => {
      localStorage.removeItem("autopilot_token");
      router.push("/login");
    });

    api.get("/api/auth/usage").then((res) => {
      const data = res.data || {};
      const usedValue = typeof data.used === "number" ? data.used : typeof data.used_generations === "number" ? data.used_generations : null;
      const limitValue = typeof data.limit === "number" ? data.limit : typeof data.monthly_limit === "number" ? data.monthly_limit : null;
      setUsed(usedValue);
      setLimit(limitValue);
    }).finally(() => setUsageLoading(false));
  }, [router]);

  const progress = used !== null && limit !== null && limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const remaining = used !== null && limit !== null ? Math.max(0, limit - used) : null;

  return (
    <div className="min-h-screen bg-white text-black">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        {/* MINIMAL HERO */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-8xl font-thin tracking-wider">
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </h1>
          <p className="mt-8 text-2xl text-gray-500 font-light">
            Precision tools for ambitious builders.
          </p>
        </motion.section>

        {/* ELEGANT USAGE CARD */}
        {limit !== null && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-32"
          >
            <div className="rounded-none border-t border-b border-gray-200 py-16">
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Monthly Generations</p>
                <p className="text-5xl font-light mb-12">
                  {usageLoading ? "—" : limit === null ? "Unlimited" : `${used ?? 0} / ${limit}`}
                </p>

                {limit !== null && (
                  <>
                    <div className="max-w-2xl mx-auto h-1 bg-gray-200 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-black"
                      />
                    </div>
                    <p className="mt-8 text-gray-500">
                      {remaining !== null ? `${remaining} remaining` : "No limits on your plan"} • Resets monthly
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* SOPHISTICATED ACTION GRID */}
        <section className="mb-32">
          <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-4">
            <MinimalActionCard
              title="Generate Content"
              description="Sophisticated posts, threads, and narratives"
              href="/dashboard/content"
            />
            <MinimalActionCard
              title="Write Emails & Replies"
              description="Elegant, persuasive communication"
              href="/dashboard/email"
            />
            <MinimalActionCard
              title="Create Ads"
              description="Precision-targeted campaigns and copy"
              href="/dashboard/ads"
            />
            <MinimalActionCard
              title="My Work"
              description="Curated archive of all your creations"
              href="/dashboard/work"
            />
          </div>
        </section>

        {/* REFINED DUAL PANELS */}
        <section className="grid gap-12 md:grid-cols-2">
          {/* Daily Focus */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-gray-200 p-12"
          >
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">
              Today's Strategic Focus
            </p>
            <h3 className="text-4xl font-light mb-6 leading-tight">{focus.title}</h3>
            <p className="text-lg text-gray-600 mb-10">{focus.subtitle}</p>
            <ul className="space-y-6">
              {focus.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-6">
                  <div className="w-8 h-px bg-gray-300 mt-3 flex-shrink-0" />
                  <span className="text-gray-800 leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Plan & Upgrade */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-black text-white p-12 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm uppercase tracking-widest text-amber-500 mb-6">
                Current Plan
              </p>
              <h3 className="text-4xl font-light mb-8">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                  : "Free"}
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Elevate your capabilities with unlimited access and priority execution.
              </p>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-12 py-4 border border-white text-white font-medium hover:bg-white hover:text-black transition"
            >
              Explore Upgrades
            </button>
          </motion.div>
        </section>

        {/* INSPIRATIONAL QUOTE FOOTER */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 text-center py-20 border-t border-gray-200"
        >
          <p className="text-3xl md:text-4xl font-light italic text-gray-700 max-w-4xl mx-auto leading-relaxed">
            “{quote.text}”
          </p>
          <p className="mt-8 text-lg text-amber-600 font-medium">
            — {quote.author}
          </p>
        </motion.section>
      </main>
    </div>
  );
}

/* MINIMAL ACTION CARD */
function MinimalActionCard({ title, description, href }: { title: string; description: string; href: string }) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(href)}
      className="text-left p-12 border border-gray-200 hover:border-black transition-all group"
    >
      <h3 className="text-2xl font-light mb-4 group-hover:font-normal transition">{title}</h3>
      <p className="text-gray-600 group-hover:text-black transition">{description}</p>
      <span className="mt-8 inline-block text-sm font-medium opacity-0 group-hover:opacity-100 transition">
        Enter →
      </span>
    </motion.button>
  );
}