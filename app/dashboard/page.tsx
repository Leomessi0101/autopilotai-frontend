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

  /* =========================
     WEBSITE BUILDER STATE
  ========================= */
  const [websiteUsername, setWebsiteUsername] = useState("");
  const [creatingWebsite, setCreatingWebsite] = useState(false);
  const [websiteError, setWebsiteError] = useState<string | null>(null);

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

  /* =========================
     CREATE WEBSITE
  ========================= */
  const handleCreateWebsite = async () => {
    setWebsiteError(null);

    if (!websiteUsername.trim()) {
      setWebsiteError("Please choose a website username.");
      return;
    }

    setCreatingWebsite(true);

    try {
      const res = await api.post("/dashboard/websites/create", {
        username: websiteUsername,
      });

      if (res.data?.redirect) {
        router.push(res.data.redirect);
      }
    } catch (err: any) {
      setWebsiteError(
        err?.response?.data?.detail ||
          "Failed to create website. Please try again."
      );
    } finally {
      setCreatingWebsite(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Greeting */}
        <section className="mb-20">
          <h1 className="text-5xl md:text-6xl font-light">
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Your tools are ready. Let’s work.
          </p>
        </section>

        {/* WEBSITE BUILDER */}
        <section className="mb-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10">
          <h2 className="text-3xl font-medium mb-4">Website Builder</h2>
          <p className="text-gray-300 mb-8">
            Create your own business website in minutes. One site per account.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-xl">
            <input
              value={websiteUsername}
              onChange={(e) => setWebsiteUsername(e.target.value.toLowerCase())}
              placeholder="your-business-name"
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-[#6d8ce8]"
            />

            <button
              disabled={creatingWebsite}
              onClick={handleCreateWebsite}
              className="px-6 py-3 rounded-xl bg-[#6d8ce8] text-black font-medium hover:bg-[#8aa3ff] transition disabled:opacity-50"
            >
              {creatingWebsite ? "Creating…" : "Create Website"}
            </button>
          </div>

          {websiteError && (
            <p className="mt-4 text-red-400">{websiteError}</p>
          )}
        </section>

        {/* TOOLS */}
        <section className="mb-20">
          <h2 className="text-3xl font-medium mb-10">Tools</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              title="One-Click Growth Pack"
              description="Generate content, emails & ads in one pass"
              href="/growth-pack"
            />
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

        {/* Quote */}
        <section className="text-center py-16 border-t border-white/10">
          <p className="text-2xl md:text-3xl font-light italic text-gray-300 max-w-4xl mx-auto">
            “{quote.text}”
          </p>
          <p className="mt-6 text-lg text-[#6d8ce8] font-medium">
            — {quote.author}
          </p>
        </section>
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
      className="text-left rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-[#2b4e8d]"
    >
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.button>
  );
}
