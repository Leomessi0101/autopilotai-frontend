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

type ParsedAd = {
  headline: string;
  primary: string;
  cta: string;
};

export default function AdsPage() {
  const router = useRouter();

  const [platform, setPlatform] = useState("meta");
  const [objective, setObjective] = useState("Leads");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");

  const [result, setResult] = useState("");
  const [parsedAds, setParsedAds] = useState<ParsedAd[]>([]);

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
        prompt: `Generate ${platform} ad copy with objective: ${objective}. Product: ${product}. Audience: ${audience}.`,
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

    const ads: ParsedAd[] = blocks.map((block) => {
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

        {/* Main */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10"
          >
            {/* Platform */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Platform
              </label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      platform === p.key
                        ? "bg-blue-900 text-white"
                        : "bg-gray-100 hover:bg-blue-50 hover:text-blue-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Objective
              </label>
              <div className="flex flex-wrap gap-3">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjective(o)}
                    className={`px-6 py-3 rounded-xl font-medium transition ${
                      objective === o
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 hover:bg-teal-50 hover:text-teal-900"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                What are you promoting?
              </label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 transition"
                placeholder="e.g. Premium custom mouthguards for fighters"
              />
            </div>

            {/* Audience */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Target audience
              </label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 transition"
                placeholder="e.g. Combat athletes ages 18–35"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Ad Copy"}
              </button>

              {error && <p className="text-red-600 ml-4">{error}</p>}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Tips for better ads
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li>Lead with the biggest benefit</li>
                <li>Hook attention in the first line</li>
                <li>Use one strong CTA</li>
                <li>Test multiple variations</li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Results */}
        {parsedAds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <h3 className="text-3xl font-semibold text-gray-900 mb-8">
              Preview Your Ads
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {parsedAds.map((ad, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-500 mb-2">
                    Ad Variation #{i + 1}
                  </p>

                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {ad.headline}
                  </h2>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {ad.primary}
                  </p>

                  <button className="w-full py-3 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition">
                    {ad.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-right mt-10">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-8 py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition"
              >
                Copy Raw Text
              </button>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
