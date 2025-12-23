"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import { ArrowRight, Sparkles, Zap, MessageSquare, Megaphone, FolderOpen, TrendingUp } from "lucide-react"; // Optional: add lucide-react if you want icons (or remove and use Unicode)

/* =========================
   QUOTES & DAILY FOCUS (unchanged logic)
   ========================= */
const QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Consistency is the last refuge of the unimaginative? No — it's the foundation of greatness.", author: "AutopilotAI" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Amateurs wait for inspiration. The rest of us just get up and go to work.", author: "Stephen King" },
];

const AI_DAILY_FOCUS = [
  {
    title: "Dominate Visibility",
    subtitle: "Get seen by more of the right people",
    tasks: ["Post one high-engagement hook", "Reply to 5 recent comments/DMs", "Share one value-first story"],
    icon: TrendingUp,
  },
  {
    title: "Close More Deals",
    subtitle: "Turn conversations into customers",
    tasks: ["Send 3 personalized follow-ups", "Refine your core offer messaging", "Test one new ad angle"],
    icon: Zap,
  },
  {
    title: "Build Authority",
    subtitle: "Become the go-to voice in your space",
    tasks: ["Start a long-form thread or post", "Repurpose your best content", "Plan next week's themes"],
    icon: Sparkles,
  },
  {
    title: "Strengthen Your Brand",
    subtitle: "Make everything feel unmistakably you",
    tasks: ["Audit tone in last 5 posts", "Update one email template", "Clarify your one-sentence promise"],
    icon: MessageSquare,
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

  const Icon = focus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-black">
      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* HERO GREETING + QUOTE */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
              {greeting}
              {fullName ? `, ${fullName}` : ""}.
            </h1>
            <p className="mt-6 text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto">
              Your AI is warmed up and ready. Let&apos;s make today count.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-3xl mx-auto rounded-3xl bg-white border border-gray-200 p-10 shadow-2xl"
          >
            <p className="text-lg italic text-gray-800 leading-relaxed text-center">
              “{quote.text}”
            </p>
            <p className="mt-6 text-center text-amber-600 font-semibold text-lg">
              — {quote.author}
            </p>
          </motion.div>
        </section>

        {/* USAGE HERO CARD */}
        {limit !== null && (
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-1 shadow-2xl"
            >
              <div className="rounded-3xl bg-white p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-4xl font-extrabold">Monthly Generations</h3>
                    <p className="mt-3 text-xl text-gray-600">
                      {usageLoading ? "Loading…" : `${used ?? 0} of ${limit} used this month`}
                    </p>
                  </div>

                  <div className="w-full max-w-md">
                    <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500"
                      />
                    </div>
                    <p className="mt-4 text-right text-sm text-gray-600">
                      {remaining !== null ? `${remaining} remaining • Resets monthly` : "Unlimited"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* QUICK ACTIONS – BIG, BOLD, PLAYFUL */}
        <section className="mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
            What will you build today?
          </h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <BigActionCard
              title="Generate Content"
              description="Posts, hooks, threads that actually get attention"
              href="/dashboard/content"
              gradient="from-blue-500 to-cyan-500"
              icon="✍️"
            />
            <BigActionCard
              title="Write Emails & Replies"
              description="Close deals while you sleep"
              href="/dashboard/email"
              gradient="from-purple-500 to-pink-500"
              icon="📧"
            />
            <BigActionCard
              title="Create Ads"
              description="Winning angles for Meta, Google, TikTok"
              href="/dashboard/ads"
              gradient="from-green-500 to-emerald-500"
              icon="📢"
            />
            <BigActionCard
              title="My Work"
              description="Everything you've created — organized"
              href="/dashboard/work"
              gradient="from-amber-500 to-orange-500"
              icon="📂"
            />
          </div>
        </section>

        {/* AI FOCUS + PLAN */}
        <section className="grid gap-10 md:grid-cols-2">
          {/* AI Daily Focus */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-white border-2 border-amber-500 p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-100 rounded-full opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                {Icon && <Icon className="w-8 h-8 text-amber-600" />}
                <p className="text-sm uppercase tracking-wider text-amber-600 font-bold">
                  AI Recommended Focus
                </p>
              </div>
              <h3 className="text-3xl font-extrabold mb-3">{focus.title}</h3>
              <p className="text-lg text-gray-600 mb-8">{focus.subtitle}</p>
              <ul className="space-y-4">
                {focus.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1 w-4 h-4 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-black text-white p-10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <p className="text-amber-400 text-sm uppercase tracking-wider font-bold mb-2">
                Your Current Plan
              </p>
              <h3 className="text-4xl font-extrabold mb-6">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                  : "Free"}
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                You're doing the work. Let's remove the limits.
              </p>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-10 w-full py-5 rounded-full bg-amber-500 text-black font-bold text-lg hover:bg-amber-400 transition shadow-xl"
            >
              Upgrade Now →
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

/* BIG, PLAYFUL ACTION CARDS */
function BigActionCard({ title, description, href, gradient, icon }: { title: string; description: string; href: string; gradient: string; icon: string }) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ y: -12, scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className={`relative rounded-3xl p-10 text-left text-white overflow-hidden shadow-2xl group`}
      style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition`} />
      <div className="relative z-10">
        <div className="text-6xl mb-6">{icon}</div>
        <h3 className="text-3xl font-extrabold mb-3">{title}</h3>
        <p className="text-lg opacity-90">{description}</p>
        <ArrowRight className="mt-8 w-8 h-8 opacity-80 group-hover:translate-x-4 transition-transform" />
      </div>
    </motion.button>
  );
}