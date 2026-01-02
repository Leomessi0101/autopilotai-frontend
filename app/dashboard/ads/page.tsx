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
        e?.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const parseAds = (text: string) => {
    const blocks = text
      .split(/AD\s*\d+:/gi)
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const ads = blocks.map((block) => {
      const headlineMatch = block.match(/Headline:\s*(.*)/i);
      const primaryMatch = block.match(/Primary text:\s*([\s\S]*?)CTA:/i);
      const ctaMatch = block.match(/CTA:\s*(.*)/i);

      return {
        headline: headlineMatch?.[1]?.trim() || "Untitled Ad",
        primary: primaryMatch?.[1]?.trim() || block,
        cta: ctaMatch?.[1]?.trim() || "Learn More",
      };
    });

    setParsedAds(ads);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">

      {/* Cinematic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-[#0c1a39] via-[#0a1630] to-transparent blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-[#0d1b3d] via-[#111a2c] to-transparent blur-[200px]" />
      </div>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            Ad Generator
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            High-conversion ad copy tailored to platform, objective, and audience.
          </p>
        </motion.section>

        {/* Main Grid */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <div className="mb-10">
              <p className="text-lg font-medium text-gray-200">
                Define your campaign
              </p>
            </div>

            {/* Platform */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Platform
              </label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      platform === p.key
                        ? "bg-white text-black"
                        : "bg-white/10 text-gray-200 hover:bg-white/20"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Objective
              </label>
              <div className="flex flex-wrap gap-3">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      objective === o
                        ? "bg-[#2b4e8d] text-white"
                        : "bg-white/10 text-gray-200 hover:bg-white/20"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What are you promoting?
              </label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Premium custom mouthguards for combat athletes"
                className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#6d8ce8]"
              />
            </div>

            {/* Audience */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target audience
              </label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Fighters aged 18–35 training at gyms"
                className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#6d8ce8]"
              />
            </div>

            {/* Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-white text-black rounded-xl font-medium disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Ad Copy"}
              </button>

              {error && <p className="text-red-400 ml-4">{error}</p>}
            </div>

            <p className="mt-6 text-sm text-gray-400">
              All generated ads are automatically saved in My Work.
            </p>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-gray-200 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <h4 className="text-lg font-semibold mb-4">
              Guidelines for stronger ads
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>Lead with the main benefit</li>
              <li>Hook attention in the first line</li>
              <li>Use one clear CTA</li>
              <li>Test multiple variations</li>
            </ul>
          </motion.div>
        </section>

        {/* Result */}
        {parsedAds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <h3 className="text-3xl font-semibold mb-8">
              Preview Your Ads
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {parsedAds.map((ad, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,.55)] p-6"
                >
                  <p className="text-sm text-gray-400 mb-2">
                    Ad Variation #{i + 1}
                  </p>

                  <h2 className="text-xl font-bold text-white mb-3">
                    {ad.headline}
                  </h2>

                  <p className="text-gray-200 leading-relaxed mb-6">
                    {ad.primary}
                  </p>

                  <button className="w-full py-3 bg-white text-black rounded-xl font-medium">
                    {ad.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-right mt-10">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-8 py-4 bg-white text-black rounded-xl font-medium"
              >
                Copy Raw Text
              </button>
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10 text-gray-400">
          Questions? Email{" "}
          <a
            href="mailto:contact@autopilotai.dev"
            className="text-[#6d8ce8] hover:underline"
          >
            contact@autopilotai.dev
          </a>
        </footer>
      </main>
    </div>
  );
}
