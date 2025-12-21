"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const PLATFORMS = [
  { key: "meta", label: "Facebook / Instagram" },
  { key: "google", label: "Google Search" },
  { key: "tiktok", label: "TikTok" },
];

const OBJECTIVES = ["Leads", "Sales", "Traffic", "Brand Awareness"];

export default function AdsPage() {
  const router = useRouter();

  const [platform, setPlatform] = useState("meta");
  const [objective, setObjective] = useState("Leads");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* Load theme + user */
  useEffect(() => {
    const saved = localStorage.getItem("autopilot-theme");
    if (saved === "dark") setTheme("dark");

    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      });
  }, [router]);

  const isDark = theme === "dark";

  const handleGenerate = async () => {
    setError("");
    setResult("");

    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!product.trim() || !audience.trim()) {
      setError("Fill in product + audience.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/ads/generate", {
        platform,
        objective,
        product,
        audience,
      });

      setResult(res.data.output || "");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-[#0A0A0D] text-white" : "bg-white text-black"
      }`}
    >
      {/* NAVBAR */}
      <header
        className={`w-full py-6 px-6 md:px-12 flex justify-between items-center border-b sticky top-0 backdrop-blur-xl z-50 ${
          isDark ? "border-gray-800 bg-[#0A0A0D]/80" : "border-gray-200 bg-white/80"
        }`}
      >
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          AutopilotAI<span className="text-amber-500">.</span>
        </h1>

        <div className="flex items-center gap-6 text-sm">
          <button onClick={() => router.push("/dashboard")} className="hover:underline">
            Dashboard
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setMenuOpen(true)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-sm font-semibold text-black shadow"
          >
            {name}
          </motion.button>
        </div>
      </header>

      {/* PROFILE PANEL */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
              className={`fixed top-24 right-6 w-80 rounded-3xl z-50 overflow-hidden border ${
                isDark ? "bg-[#0E0E12] border-gray-800" : "bg-white border-gray-200"
              } shadow-2xl`}
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Plan</p>
                    <p className="text-lg font-bold capitalize">
                      {subscriptionPlan ?? "Free"}
                    </p>
                  </div>
                  <button onClick={() => setMenuOpen(false)}>✕</button>
                </div>
              </div>

              <div className="p-3">
                <MenuItem label="Dashboard" onClick={() => router.push("/dashboard")} />
                <MenuItem label="My Work" onClick={() => router.push("/dashboard/work")} />
                <MenuItem label="Billing" onClick={() => router.push("/billing")} />
                <MenuItem label="Pricing" onClick={() => router.push("/pricing")} />

                <div className="border-t mt-3 pt-2">
                  <MenuItem
                    label="Logout"
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

      {/* MAIN */}
      <div className="px-6 md:px-16 py-14 max-w-7xl w-full mx-auto flex-1">
        <h2 className="text-4xl md:text-5xl font-bold">Ad Generator</h2>
        <p className={isDark ? "text-gray-400 mt-3" : "text-gray-600 mt-3"}>
          Build high-converting ad campaigns fast.
        </p>

        {/* BUILDER */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 grid gap-10 lg:grid-cols-[2fr,1fr]"
        >
          {/* LEFT PANEL */}
          <div
            className={`rounded-3xl border p-8 ${
              isDark ? "border-gray-800 bg-[#0F0F14]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Step 1 — Define the campaign
            </p>

            {/* PLATFORM */}
            <div className="mt-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Platform</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      platform === p.key
                        ? "bg-amber-500 border-amber-500 text-white"
                        : isDark
                        ? "border-gray-700 text-gray-400 hover:border-amber-400"
                        : "border-gray-300 text-gray-700 hover:border-amber-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* OBJECTIVE */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Objective</p>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      objective === o
                        ? "bg-black text-white border-black"
                        : isDark
                        ? "border-gray-700 text-gray-400 hover:border-amber-400"
                        : "border-gray-300 text-gray-700 hover:border-amber-400"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT */}
            <label className="text-sm text-gray-500">What are you selling?</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Example: Custom MMA mouthguards, $60, pro fit + protection"
              className={`w-full mt-2 p-4 rounded-2xl border outline-none ${
                isDark
                  ? "bg-[#0B0B0E] border-gray-800 focus:border-amber-500"
                  : "bg-white border-gray-200 focus:border-black"
              }`}
            />

            {/* AUDIENCE */}
            <label className="text-sm text-gray-500 mt-6 block">Who is this for?</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Example: Fighters 18–35 who train combat sports weekly"
              className={`w-full mt-2 p-4 rounded-2xl border outline-none ${
                isDark
                  ? "bg-[#0B0B0E] border-gray-800 focus:border-amber-500"
                  : "bg-white border-gray-200 focus:border-black"
              }`}
            />

            {/* PRESETS */}
            <div className="flex flex-wrap gap-2 mt-6">
              <QuickChip
                label="Direct response"
                onClick={() =>
                  setProduct(
                    "Custom MMA mouthguards with pro-level protection, perfect fit + custom designs."
                  )
                }
              />
              <QuickChip
                label="Brand angle"
                onClick={() =>
                  setAudience(
                    "Combat sports fans who want to look sharp, stay safe and train confidently."
                  )
                }
              />
              <QuickChip
                label="High ticket"
                onClick={() =>
                  setProduct(
                    "Done-for-you custom mouthguard packages for gyms including branding + bulk pricing."
                  )
                }
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 px-8 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate Ad Copy"}
            </button>

            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

            <p className="text-xs text-gray-500 mt-2">
              Saved automatically in <b>My Work</b>.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-4">
            <div
              className={`rounded-3xl p-6 border ${
                isDark ? "border-gray-800 bg-[#0F0F14]" : "border-gray-200 bg-gray-50"
              }`}
            >
              <h4 className="font-semibold mb-2 text-sm">Stronger ad inputs</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Mention the offer + main benefit</li>
                <li>• Say exactly who it’s for</li>
                <li>• Include price if it matters</li>
                <li>• Decide urgency or brand tone</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-300 bg-amber-50/40 p-6 text-sm text-amber-800">
              Performance tip:
              <br />
              Test 3–5 angles. Don’t rely on one.
            </div>
          </div>
        </motion.section>

        {/* RESULT */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 pb-24"
          >
            <div
              className={`rounded-3xl border p-8 ${
                isDark ? "border-amber-500/40 bg-[#0F0F14]" : "border-amber-300 bg-amber-50"
              }`}
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  Generated Ad Copy · <span className="capitalize">{platform}</span>
                </h3>

                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 rounded-full border border-amber-400 hover:bg-amber-100 transition text-sm"
                >
                  Copy
                </button>
              </div>

              <pre className="whitespace-pre-wrap leading-relaxed text-[15px]">
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
function MenuItem({ label, onClick, danger = false }: any) {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full px-4 py-3 text-left text-sm ${
        danger ? "text-red-500" : "text-gray-400"
      } hover:bg-black/10`}
    >
      {label}
    </motion.button>
  );
}

function QuickChip({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700 hover:border-amber-400 hover:text-amber-700 transition"
    >
      {label}
    </button>
  );
}
