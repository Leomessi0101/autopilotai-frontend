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
  const [parsedAds, setParsedAds] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<string | null>(null);

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
    setParsedAds([]);

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
        prompt: `Generate ad copy for ${platform} with objective ${objective}. Product: ${product}. Audience: ${audience}.`,
      });

      const output = res.data.output || "";
      setResult(output);
      parseAds(output);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const parseAds = (text: string) => {
    const blocks = text
      .split(/AD\s*\d+:/gi)
      .map((b) => b.trim())
      .filter(Boolean);

    const ads = blocks.map((block) => {
      const headlineMatch = block.match(/Headline:\s*(.*)/i);
      const primaryMatch = block.match(
        /Primary text:\s*([\s\S]*?)CTA:/i
      );
      const ctaMatch = block.match(/CTA:\s*(.*)/i);

      return {
        headline: headlineMatch?.[1]?.trim() || "Untitled Ad",
        primary: primaryMatch?.[1]?.trim() || block,
        cta: ctaMatch?.[1]?.trim() || "Learn More",
      };
    });

    setParsedAds(ads);
  };

  const copyAll = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  const clearAll = () => {
    setProduct("");
    setAudience("");
    setParsedAds([]);
    setResult("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-light">
                Ad Generator
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                High-conversion ad copy, tailored by platform, objective,
                and audience.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard/work")}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2b4e8d] transition"
              >
                My Work →
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.section>

        {/* MAIN GRID */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          {/* INPUT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_60px_140px_rgba(0,0,0,.55)]"
          >
            {/* PLATFORM */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Platform
              </p>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-6 py-3 rounded-2xl transition font-medium ${
                      platform === p.key
                        ? "bg-[#6d8ce8] text-black shadow-[0_0_30px_rgba(109,140,232,.5)]"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:border-[#6d8ce8]/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* OBJECTIVE */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Objective
              </p>
              <div className="flex flex-wrap gap-3">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-6 py-3 rounded-2xl transition ${
                      objective === o
                        ? "bg-white text-black"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What are you promoting?
              </label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Premium custom mouthguards for fighters"
                className="w-full px-5 py-4 rounded-2xl bg-black/25 border border-white/20 text-white focus:ring-2 focus:ring-[#6d8ce8] outline-none"
              />
            </div>

            {/* AUDIENCE */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target audience
              </label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Combat athletes aged 18–35"
                className="w-full px-5 py-4 rounded-2xl bg-black/25 border border-white/20 text-white focus:ring-2 focus:ring-[#6d8ce8] outline-none"
              />
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between gap-6">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-[#6d8ce8] text-black rounded-2xl font-medium hover:bg-white transition disabled:opacity-60 shadow-[0_20px_60px_rgba(109,140,232,.25)]"
              >
                {loading ? "Generating…" : "Generate Ads"}
              </button>

              {error && <p className="text-red-400">{error}</p>}
            </div>

            <p className="mt-6 text-xs text-gray-400">
              All generated ads are automatically saved to My Work.
            </p>
          </motion.div>

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="space-y-8"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_40px_100px_rgba(0,0,0,.45)]">
              <p className="text-sm font-medium text-gray-200 mb-4">
                High-performing ad principles
              </p>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>• Lead with the core benefit</li>
                <li>• Hook attention immediately</li>
                <li>• One clear CTA only</li>
                <li>• Specific beats clever</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-medium text-gray-200 mb-4">
                Quick actions
              </p>
              <div className="grid gap-3">
                <button
                  onClick={copyAll}
                  disabled={!result}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-[#6d8ce8]/60 transition disabled:opacity-50 text-left"
                >
                  Copy all ad text
                </button>
                <button
                  onClick={() => router.push("/dashboard/work")}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-[#2b4e8d] transition text-left"
                >
                  Open My Work
                </button>
              </div>
            </div>
          </motion.aside>
        </section>

        {/* RESULTS */}
        {parsedAds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <h3 className="text-3xl font-semibold mb-10">
              Ad Variations
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {parsedAds.map((ad, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,.55)] p-6"
                >
                  <p className="text-xs text-gray-400 mb-2">
                    Variation #{i + 1}
                  </p>

                  <h2 className="text-xl font-bold text-white mb-3">
                    {ad.headline}
                  </h2>

                  <p className="text-gray-200 leading-relaxed mb-6 whitespace-pre-wrap">
                    {ad.primary}
                  </p>

                  <button className="w-full py-3 bg-white text-black rounded-2xl font-medium">
                    {ad.cta}
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
