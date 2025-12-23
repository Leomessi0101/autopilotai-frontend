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
  { text: "Small daily improvements are the key to staggering long-term results.", author: "James Clear" },
  { text: "The magic you’re looking for is in the work you’re avoiding.", author: "Unknown" },
  { text: "Consistency beats intensity every single time.", author: "AutopilotAI" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "You don’t need more time. You need more focus.", author: "AutopilotAI" },
];

const AI_DAILY_FOCUS = [
  {
    title: "Show Up Boldly",
    subtitle: "Make your presence felt today",
    tasks: ["Drop one value-packed post", "Reply to recent messages with personality", "Share something real behind the scenes"],
  },
  {
    title: "Nurture Your Leads",
    subtitle: "Turn conversations into connections",
    tasks: ["Follow up with 3 warm contacts", "Send one thoughtful outreach", "Refine your main offer line"],
  },
  {
    title: "Create Momentum",
    subtitle: "Build content that compounds",
    tasks: ["Plan tomorrow’s post now", "Repurpose one strong piece", "Brainstorm 5 fresh hooks"],
  },
  {
    title: "Stay Sharp",
    subtitle: "Keep your messaging on point",
    tasks: ["Review your last 3 posts for tone", "Update one email template", "Clarify your core promise"],
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-50 text-black">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Friendly Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            {greeting}
            {fullName ? `, ${fullName}! 👋` : "!"}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600">
            Ready to create something great today?
          </p>
        </motion.section>

        {/* Usage Card – Soft & Friendly */}
        {limit !== null && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600 mb-2">Your Generations This Month</p>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  {usageLoading ? "…" : limit === null ? "Unlimited 🎉" : `${used ?? 0} / ${limit}`}
                </p>
                {limit !== null && (
                  <>
                    <div className="h-12 bg-gray-100 rounded-full overflow-hidden relative mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-amber-600"
                      />
                    </div>
                    <p className="text-gray-600">
                      {remaining !== null ? `${remaining} left — keep going!` : "No limits on your plan"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Quick Actions – Playful Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            What would you like to create? ✨
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <PlayfulCard
              title="Generate Content"
              description="Fresh posts, hooks & ideas"
              emoji="🚀"
              href="/dashboard/content"
              color="from-amber-400 to-orange-500"
            />
            <PlayfulCard
              title="Write Emails & Replies"
              description="Smart, human-sounding messages"
              emoji="💌"
              href="/dashboard/email"
              color="from-purple-400 to-pink-500"
            />
            <PlayfulCard
              title="Create Ads"
              description="Winning copy for any platform"
              emoji="📈"
              href="/dashboard/ads"
              color="from-blue-400 to-cyan-500"
            />
            <PlayfulCard
              title="My Work"
              description="All your creations in one place"
              emoji="📂"
              href="/dashboard/work"
              color="from-green-400 to-emerald-500"
            />
          </div>
        </section>

        {/* Daily Focus – Warm & Encouraging */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-10 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">☀️</span>
              <div>
                <p className="text-lg font-medium text-gray-700">Your Focus Today</p>
                <h3 className="text-3xl font-bold text-gray-900">{focus.title}</h3>
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-8 ml-16">{focus.subtitle}</p>
            <ul className="space-y-4 ml-16">
              {focus.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4 text-gray-800">
                  <span className="text-2xl mt-1">✓</span>
                  <span className="text-lg">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Plan Card – Friendly Upsell */}
        <section className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200 inline-block"
          >
            <p className="text-lg font-medium text-gray-600 mb-2">Current Plan</p>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {subscriptionPlan
                ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                : "Free"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Unlock unlimited generations and priority processing when you upgrade.
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="px-10 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
            >
              Explore Plans
            </button>
          </motion.div>
        </section>

        {/* Inspirational Quote */}
        <section className="py-20 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-3xl md:text-4xl font-medium italic text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            “{quote.text}”
          </motion.p>
          <p className="mt-6 text-xl text-amber-600 font-medium">
            — {quote.author}
          </p>
        </section>

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Need help? We&apos;re here — email us at{" "}
            <a href="mailto:contact@autopilotai.dev" className="font-medium text-black hover:underline">
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

/* PLAYFUL ACTION CARD */
function PlayfulCard({ title, description, emoji, href, color }: { title: string; description: string; emoji: string; href: string; color: string }) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="bg-white rounded-3xl shadow-lg p-8 text-left border border-gray-200 hover:border-amber-400 hover:shadow-2xl transition-all group"
    >
      <div className="text-6xl mb-6">{emoji}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
      <span className="mt-6 inline-block text-amber-600 font-medium group-hover:translate-x-2 transition">
        Go →
      </span>
    </motion.button>
  );
}