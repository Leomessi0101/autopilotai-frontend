"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  useEffect(() => {
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

  const handleGenerate = async () => {
    setError("");
    setResult("");

    if (!product.trim() || !audience.trim()) {
      setError("Fill in your product and audience to get started! 😊");
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
      setError(e?.response?.data?.detail || "Oops, something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-50 text-black">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Ad Generator 📈
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            High-converting ad copy, hooks, and angles — tailored for your platform and goal.
          </p>
        </motion.section>

        {/* Main Grid */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-16">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-lg font-medium text-gray-700">Let’s build your next winning ad</p>
              </div>
              <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Paid Ads
              </span>
            </div>

            {/* Platform */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Platform</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-6 py-3 rounded-full font-medium transition ${
                      platform === p.key
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-amber-100 hover:text-amber-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Goal</label>
              <div className="flex flex-wrap gap-3">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-6 py-3 rounded-full font-medium transition ${
                      objective === o
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-amber-100 hover:text-amber-900"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">What are you promoting?</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Custom MMA mouthguards with pro-level protection"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
              />
            </div>

            {/* Audience */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Who is your target audience?</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Fighters aged 18–35 who train at combat gyms"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
              />
            </div>

            {/* Generate Button + Error */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-60"
              >
                {loading ? "Creating your ad…" : "Generate Ad Copy 🚀"}
              </button>

              {error && <p className="text-red-500 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              All generated ads are saved in <span className="font-medium">My Work</span>.
            </p>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-lg border border-amber-100">
              <h4 className="text-xl font-bold text-gray-900 mb-4">✨ Tips for winning ads</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>Lead with a strong benefit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">👀</span>
                  <span>Hook in the first 3 seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <span>One clear call-to-action</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔥</span>
                  <span>Test multiple angles</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-3">⚡ Pro tip</h4>
              <p className="text-gray-700">
                Great ads feel personal — be specific about who it’s for and what they get.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Result */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-12 border border-amber-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-lg font-medium text-amber-800 mb-2">Your ad copy is ready! 📢</p>
                  <h3 className="text-3xl font-bold text-gray-900">Time to launch</h3>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                >
                  Copy Ad Copy
                </button>
              </div>

              <div className="bg-white rounded-2xl p-10 shadow-inner">
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg font-medium">
                  {result}
                </pre>
              </div>
            </div>
          </motion.section>
        )}

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Need help or have ideas? Email us at{" "}
            <a href="mailto:contact@autopilotai.dev" className="font-medium text-black hover:underline">
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}