"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* =========================
   DASHBOARD
========================= */

export default function DashboardPage() {
  const router = useRouter();

  const [initial, setInitial] = useState("U");
  const [fullName, setFullName] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [used, setUsed] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  /* =========================
     WEBSITE STATE
  ========================= */
  const [websiteLoading, setWebsiteLoading] = useState(true);
  const [websiteExists, setWebsiteExists] = useState(false);
  const [websiteUsername, setWebsiteUsername] = useState<string | null>(null);
  const [websiteTemplate, setWebsiteTemplate] = useState<string | null>(null);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<"restaurant" | "business" | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const quote = getDailyItem(QUOTES);
  const focus = getDailyItem(AI_DAILY_FOCUS);
  const greeting = getGreeting();

  /* =========================
     FIX: SAFE TEMPLATE LABEL
  ========================= */
  const websiteTemplateLabel =
    websiteTemplate
      ? websiteTemplate.charAt(0).toUpperCase() +
        websiteTemplate.slice(1)
      : "";

  /* =========================
     AUTH + USAGE
  ========================= */
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
        setUsed(
          typeof data.used === "number"
            ? data.used
            : typeof data.used_generations === "number"
            ? data.used_generations
            : null
        );
        setLimit(
          typeof data.limit === "number"
            ? data.limit
            : typeof data.monthly_limit === "number"
            ? data.monthly_limit
            : null
        );
      })
      .finally(() => setUsageLoading(false));
  }, [router]);

  /* =========================
     FETCH WEBSITE
  ========================= */
  useEffect(() => {
    api
      .get("/dashboard/websites/me")
      .then((res) => {
        if (res.data?.exists) {
          setWebsiteExists(true);
          setWebsiteUsername(res.data.username);
          setWebsiteTemplate(res.data.template);
        } else {
          setWebsiteExists(false);
        }
      })
      .finally(() => setWebsiteLoading(false));
  }, []);

  const progress =
    used !== null && limit !== null && limit > 0
      ? Math.min(100, (used / limit) * 100)
      : 0;

  const remaining =
    used !== null && limit !== null ? Math.max(0, limit - used) : null;

  /* =========================
     CREATE WEBSITE
  ========================= */
  async function createWebsite() {
    if (!selectedTemplate || !newUsername.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      const res = await api.post("/dashboard/websites/create", {
        username: newUsername,
        template: selectedTemplate,
      });

      if (res.data?.redirect) {
        router.push(res.data.redirect);
      }
    } catch (err: any) {
      setCreateError(
        err?.response?.data?.detail || "Failed to create website"
      );
      setCreating(false);
    }
  }

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
        <motion.section className="mb-16">
          <h1 className="text-5xl md:text-6xl font-light">
            {greeting}
            {fullName ? `, ${fullName}` : ""}.
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Your tools are ready. Let’s work.
          </p>
        </motion.section>

        {/* =========================
            WEBSITE SECTION
        ========================= */}
        <motion.section className="mb-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">
                Website Builder
              </p>
              <h2 className="text-3xl font-semibold mt-2">
                Your Website
              </h2>
            </div>
          </div>

          {websiteLoading ? (
            <div className="text-gray-400">Loading website…</div>
          ) : websiteExists ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-lg font-semibold">
                  /r/{websiteUsername}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Template: {websiteTemplateLabel}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    router.push(`/r/${websiteUsername}?edit=1`)
                  }
                  className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
                >
                  Edit Website
                </button>
                <button
                  onClick={() => router.push(`/r/${websiteUsername}`)}
                  className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
                >
                  View Live
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="text-gray-300 max-w-xl">
                Create a professional website in minutes using our
                website builder.
              </p>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#1c2f57] to-[#2b4e8d] font-medium hover:brightness-110 transition"
              >
                Create Website
              </button>
            </div>
          )}
        </motion.section>

        {/* Tools, Focus, Quote, Footer remain unchanged */}
      </main>

      {/* =========================
          TEMPLATE MODAL
      ========================= */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-[#0b0f1a] border border-white/10 rounded-2xl p-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h3 className="text-2xl font-semibold mb-6">
                Choose a template
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {["restaurant", "business"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTemplate(t as any)}
                    className={`p-5 rounded-xl border transition text-left ${
                      selectedTemplate === t
                        ? "border-[#6d8ce8] bg-white/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="font-semibold capitalize">{t}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {t === "restaurant"
                        ? "Menus, images & reservations"
                        : "Services, about & contact"}
                    </div>
                  </button>
                ))}
              </div>

              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="your-website-name"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
              />

              {createError && (
                <div className="text-sm text-red-400 mb-3">
                  {createError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedTemplate || creating}
                  onClick={createWebsite}
                  className="px-6 py-2 rounded-lg bg-white text-black font-medium disabled:opacity-50"
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
