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
      setError("Please provide both product and audience details.");
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
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-800">
            Ad Generator
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            High-conversion ad copy tailored to platform, objective, and audience.
          </p>
        </motion.section>

        {/* Main Grid */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10"
          >
            <div className="mb-10">
              <p className="text-lg font-medium text-gray-700">Define your campaign</p>
            </div>

            {/* Platform */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-3">Platform</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      platform === p.key
                        ? "bg-blue-900 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-3">Objective</label>
              <div className="flex flex-wrap gap-3">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      objective === o
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-teal-50 hover:text-teal-900"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">What are you promoting?</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Premium custom mouthguards for combat athletes"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            {/* Audience */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-600 mb-2">Target audience</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Fighters aged 18–35 training at gyms"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            {/* Generate Button + Error */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Ad Copy"}
              </button>

              {error && <p className="text-red-600 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              All generated ads are automatically saved in My Work.
            </p>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Guidelines for stronger ads</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Lead with the primary benefit</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Hook attention in the first line</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Include one clear call-to-action</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                  <span>Test multiple variations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Best practice</h4>
              <p className="text-gray-700">
                The highest-performing ads speak directly to a specific audience’s desires and challenges.
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Generated Ad Copy</p>
                  <h3 className="text-3xl font-semibold text-gray-900">Ready for review and launch</h3>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-8 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-sm"
                >
                  Copy to Clipboard
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-10">
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base font-medium">
                  {result}
                </pre>
              </div>
            </div>
          </motion.section>
        )}

        {/* Contact Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-600">
            Questions? Reach out at{" "}
            <a href="mailto:contact@autopilotai.dev" className="font-medium text-blue-900 hover:underline">
              contact@autopilotai.dev
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}