"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function EmailPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

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

    if (!details.trim()) {
      setError("Write some email details first.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/email/generate", {
        subject,
        details,
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

      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white px-6 py-8">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-semibold tracking-tight cursor-pointer"
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <nav className="mt-12 space-y-4 text-sm">
          <SidebarItem label="Dashboard" onClick={() => router.push("/dashboard")} />
          <SidebarItem label="Generate Content" onClick={() => router.push("/dashboard/content")} />
          <SidebarItem label="Write Emails" active />
          <SidebarItem label="Create Ads" onClick={() => router.push("/dashboard/ads")} />
          <SidebarItem label="My Work" onClick={() => router.push("/dashboard/work")} />
          <SidebarItem label="Billing" onClick={() => router.push("/billing")} />
          <SidebarItem label="Pricing" onClick={() => router.push("/pricing")} />
        </nav>

        <div className="mt-auto pt-6 text-xs text-gray-500">
          Communicate with confidence.
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-6 md:px-16 py-10 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center relative">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              AI Email Writer
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Outreach, follow-ups, client replies, cold emails — written in your tone.
            </p>
          </div>

          {/* Avatar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm"
          >
            {name}
            <span className="absolute inset-0 rounded-full ring-2 ring-amber-400 opacity-40" />
          </motion.button>

          {/* Profile Panel */}
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

        {/* INPUTS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl rounded-3xl border border-gray-200 p-8 bg-white shadow-sm mt-16"
        >
          {/* Subject */}
          <label className="text-sm uppercase tracking-wide text-gray-500">
            Email Subject (optional)
          </label>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Quick question about working together"
            className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {/* DETAILS */}
          <label className="text-sm uppercase tracking-wide text-gray-500 mt-6 block">
            Email Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Who is this for? What do you want? Tone? CTA? Any context?"
            rows={7}
            className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {/* BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 px-7 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate Email"}
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
            className="mt-12 max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm mb-20"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Generated Email
              </h3>

              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-5 py-2 rounded-full border border-amber-300 hover:bg-amber-100 transition text-sm"
              >
                Copy
              </button>
            </div>

            <pre className="mt-4 whitespace-pre-wrap text-gray-800 leading-relaxed text-[15px]">
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
