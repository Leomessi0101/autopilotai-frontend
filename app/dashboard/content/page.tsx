"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function ContentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name)
          setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription)
          setSubscriptionPlan(res.data.subscription);
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
      setError("Write what you want to create first.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/content/generate", {
        title,
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
    <div className="min-h-screen bg-white text-black">

      {/* 🌟 Same Universal Navbar */}
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {/* MAIN */}
      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Content Generator<span className="text-amber-500">.</span>
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Posts, captions, scripts, descriptions — written in seconds.
          </p>

          {subscriptionPlan && (
            <p className="mt-1 text-xs text-gray-500">
              Plan:{" "}
              <span className="capitalize font-medium">
                {subscriptionPlan}
              </span>
            </p>
          )}
        </div>

        {/* GENERATION AREA */}
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2.2fr),minmax(280px,1fr)] max-w-6xl"
        >
          {/* LEFT PANEL */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Step 1 · Define the content
                </p>
                <h3 className="text-xl font-semibold mt-1">
                  What do you want to create?
                </h3>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                AI Writing
              </span>
            </div>

            {/* TITLE */}
            <div className="mb-6">
              <label className="text-sm uppercase tracking-wide text-gray-500">
                Title (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Instagram caption for my MMA mouthguard brand"
                className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* DETAILS */}
            <div className="mb-5">
              <label className="text-sm uppercase tracking-wide text-gray-500">
                Content details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={7}
                placeholder="Explain what you want. Platform? Tone? Audience? Length? Key points? Example: ‘Short Instagram caption selling custom MMA mouthguards, confident tone, mention protection + style, CTA to DM’"
                className="w-full mt-3 p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-[15px]"
              />
            </div>

            {/* QUICK TEMPLATES */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Chip
                label="Instagram caption"
                onClick={() =>
                  setDetails(
                    "Instagram caption promoting custom MMA mouthguards. Confident tone, benefit-focused, short but punchy, with a strong CTA to DM for orders."
                  )
                }
              />

              <Chip
                label="Product description"
                onClick={() =>
                  setDetails(
                    "Short but powerful product description for custom MMA mouthguards. Emphasize protection, comfort, premium feel, and why it's better than cheap alternatives."
                  )
                }
              />

              <Chip
                label="YouTube script"
                onClick={() =>
                  setDetails(
                    "Short YouTube script about the importance of mouthguards in combat sports, speaking to fighters in a motivational and direct tone."
                  )
                }
              />
            </div>

            {/* BUTTON + ERROR */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-2 px-7 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate Content"}
            </button>

            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Everything you create is automatically saved in{" "}
              <span className="font-medium">My Work</span>.
            </p>
          </div>

          {/* RIGHT SIDEBAR INFO */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <h4 className="text-sm font-semibold mb-2">Tips for better results</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Say what the content is for</li>
                <li>• Mention tone (casual, funny, luxury, aggressive)</li>
                <li>• Add target audience</li>
                <li>• Include CTA if needed</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
              <h4 className="text-sm font-semibold mb-1 text-amber-800">
                Fastest workflow
              </h4>
              <p className="text-sm text-amber-800">
                Use quick templates, tweak them slightly, generate, then refine.
              </p>
            </div>
          </div>
        </motion.section>

        {/* RESULT */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-6xl pb-24"
          >
            <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-600">
                    Step 2 · Review & use
                  </p>
                  <h3 className="text-xl font-semibold">Generated Content</h3>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 rounded-full border border-amber-300 hover:bg-amber-100 transition text-sm"
                >
                  Copy content
                </button>
              </div>

              <pre className="whitespace-pre-wrap text-gray-900 leading-relaxed text-[15px]">
                {result}
              </pre>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */
function Chip({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700 hover:border-amber-400 hover:text-amber-700 transition"
    >
      {label}
    </button>
  );
}
