"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "X / Twitter" },
  { key: "linkedin", label: "LinkedIn" },
];

export default function ContentPage() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/api/auth/me")
      .then(res => {
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  const handleGenerate = async () => {
    setError("");
    setResult("");

    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!topic.trim()) {
      setError("Write what you want to create content for.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/content/generate", {
        topic,
        platform,
      });

      setResult(res.data.output || "");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex">

      {/* LEFT SIDEBAR – matches dashboard */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white px-6 py-8">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-12 space-y-4 text-sm">
          <SidebarItem label="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem label="Generate Content" active />
          <SidebarItem label="Write Emails" onClick={() => router.push("/dashboard/email")} />
          <SidebarItem label="Create Ads" onClick={() => router.push("/dashboard/ads")} />
          <SidebarItem label="My Work" onClick={() => router.push("/dashboard/work")} />
          <SidebarItem label="Billing" onClick={() => router.push("/billing")} />
          <SidebarItem label="Pricing" onClick={() => router.push("/pricing")} />
        </nav>

        <div className="mt-auto pt-6 text-xs text-gray-500">
          Create. Post. Grow.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-6 md:px-16 py-10 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center relative">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Content Generator
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Ready-to-post content powered by AI — fast, clean, effective.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm"
          >
            {name}
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
          </motion.button>

          {/* PROFILE PANEL */}
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
                  className="fixed top-20 right-6 w-80 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl z-30 overflow-hidden"
                >
                  <div className="relative px-6 pt-6 pb-4 border-b bg-amber-50">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="absolute right-4 top-4 text-sm text-gray-500 hover:text-black"
                    >
                      ✕
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                        {name}
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">Plan</p>
                        <p className="font-bold capitalize">
                          {subscriptionPlan ?? "Free"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <MenuItem label="Dashboard" onClick={() => router.push("/dashboard")} />
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
        </div>

        {/* INPUT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl rounded-3xl border border-gray-200 p-8 bg-white shadow-sm mt-16"
        >
          {/* PLATFORM SELECTOR */}
          <div className="mb-7">
            <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">
              Platform
            </p>

            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`px-4 py-2 rounded-full border transition text-sm
                  ${
                    platform === p.key
                      ? "bg-amber-500 border-amber-500 text-white"
                      : "border-gray-300 text-gray-700 hover:border-amber-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* TOPIC INPUT */}
          <label className="text-sm uppercase tracking-wide text-gray-500">
            What are we posting about?
          </label>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Custom MMA mouthguards for fighters"
            className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {/* GENERATE */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 px-7 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate Content"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}
        </motion.div>

        {/* RESULT */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-10 max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm mb-20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Generated Content{" "}
                <span className="text-amber-600 capitalize">
                  · {platform}
                </span>
              </h3>

              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-4 py-2 rounded-full border border-amber-300 hover:bg-amber-100 transition text-sm"
              >
                Copy
              </button>
            </div>

            <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed text-[15px]">
              {result}
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ label, onClick, active = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-2 transition text-sm ${
        active ? "text-black font-semibold" : "hover:translate-x-1"
      }`}
    >
      {label}
    </button>
  );
}

function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-6 py-3 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-700"
      } hover:bg-gray-100`}
    >
      {label}
    </motion.button>
  );
}
