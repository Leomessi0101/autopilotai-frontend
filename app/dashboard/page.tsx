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
  { text: "The work you do while you procrastinate is probably the work you should be doing for the rest of your life.", author: "Jessica Hische" },
  { text: "Momentum is a cruel mistress. Once you have it, she makes everything easy. Until then, she makes you earn every inch.", author: "AutopilotAI" },
  { text: "The most dangerous distraction is the one that feels like progress.", author: "James Clear" },
  { text: "Stop thinking about building an audience. Start thinking about serving one.", author: "AutopilotAI" },
  { text: "Your next level requires a version of you that doesn’t exist yet. Build her.", author: "AutopilotAI" },
];

const AI_DAILY_FOCUS = [
  {
    title: "Ignite Momentum",
    subtitle: "One action today that your future self will thank you for",
    tasks: ["Ship one piece of content no matter what", "Message one person who could change everything", "Decide on the next move and take the first step"],
  },
  {
    title: "Sharpen Your Edge",
    subtitle: "Small refinements that compound into massive advantage",
    tasks: ["Cut one thing that’s draining energy", "Strengthen your core message", "Upgrade one tool or template"],
  },
  {
    title: "Own the Conversation",
    subtitle: "Be the signal in a world full of noise",
    tasks: ["Say the thing others are afraid to say", "Create content that polarizes the right people", "Double down on what’s already working"],
  },
  {
    title: "Protect Your Energy",
    subtitle: "Ruthless focus on what actually moves the needle",
    tasks: ["Say no to one low-leverage request", "Batch tomorrow’s distractions", "End the day with a win"],
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
  if (hour < 12) return "Rise & conquer";
  if (hour < 18) return "Keep pushing";
  return "Finish strong";
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
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        {/* HERO – DARK, INTENSE, MOTIVATIONAL */}
        <section className="mb-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase"
          >
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 text-2xl md:text-3xl text-gray-400 font-light tracking-wide"
          >
            Most people won’t do the work. You will.
          </motion.p>
        </section>

        {/* USAGE – BRUTALIST BAR */}
        {limit !== null && (
          <section className="mb-32">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="bg-gray-900 p-12 rounded-none border-4 border-white"
            >
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Power Used This Month</p>
                <p className="text-6xl font-black mb-10">
                  {usageLoading ? "––" : limit === null ? "UNLIMITED" : `${used ?? 0}/${limit}`}
                </p>
                {limit !== null && (
                  <div className="h-16 bg-gray-800 relative overflow-hidden">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                <p className="mt-6 text-gray-400">
                  {remaining !== null ? `${remaining} generations left` : "No limits. Full power."}
                </p>
              </div>
            </motion.div>
          </section>
        )}

        {/* ACTION GRID – HIGH IMPACT */}
        <section className="mb-32">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ImpactCard
              title="Generate Content"
              description="Create what gets attention"
              href="/dashboard/content"
              color="from-amber-500 to-orange-600"
            />
            <ImpactCard
              title="Write Emails"
              description="Close more, faster"
              href="/dashboard/email"
              color="from-purple-600 to-pink-600"
            />
            <ImpactCard
              title="Create Ads"
              description="Launch campaigns that convert"
              href="/dashboard/ads"
              color="from-cyan-500 to-blue-600"
            />
            <ImpactCard
              title="My Work"
              description="Everything you've built"
              href="/dashboard/work"
              color="from-gray-600 to-gray-800"
            />
          </div>
        </section>

        {/* DAILY FOCUS – BRUTAL TRUTH */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-red-600 to-amber-600 p-16 text-center rounded-none"
          >
            <p className="text-sm uppercase tracking-widest text-white/80 mb-4">Today’s Hard Truth</p>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">{focus.title}</h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">{focus.subtitle}</p>
            <div className="space-y-6 max-w-2xl mx-auto">
              {focus.tasks.map((task, i) => (
                <p key={i} className="text-2xl font-bold text-white">{task}</p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PLAN UPGRADE – NO EXCUSES */}
        <section className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="bg-white text-black p-16"
          >
            <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">Current Level</p>
            <h3 className="text-6xl font-black mb-6">
              {subscriptionPlan
                ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                : "Free"}
            </h3>
            <p className="text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Good is the enemy of great. Remove the limits.
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="px-20 py-6 bg-black text-white text-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition"
            >
              Level Up Now
            </button>
          </motion.div>
        </section>

        {/* FINAL QUOTE – FULL BLEED */}
        <section className="py-32 bg-black text-center border-t-8 border-amber-500">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-4xl md:text-6xl font-light italic text-gray-300 max-w-5xl mx-auto leading-relaxed"
          >
            “{quote.text}”
          </motion.p>
          <p className="mt-10 text-2xl text-amber-500 font-medium">
            — {quote.author}
          </p>
        </section>
      </main>
    </div>
  );
}

/* HIGH-IMPACT ACTION CARD */
function ImpactCard({ title, description, href, color }: { title: string; description: string; href: string; color: string }) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ y: -12, scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className={`relative p-12 rounded-none overflow-hidden text-white group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition`} />
      <div className="relative z-10 text-left">
        <h3 className="text-3xl font-black mb-4">{title}</h3>
        <p className="text-lg opacity-90">{description}</p>
        <span className="mt-8 inline-block text-4xl font-black group-hover:translate-x-6 transition-transform">
          →
        </span>
      </div>
    </motion.button>
  );
}