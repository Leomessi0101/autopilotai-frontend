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

  const [copyToast, setCopyToast] = useState(false);

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
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const clearAll = () => {
    setProduct("");
    setAudience("");
    setParsedAds([]);
    setResult("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b06_1px,transparent_1px),linear-gradient(to_bottom,#1e293b06_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative">
        <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

        {copyToast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500/95 text-white border border-emerald-400/30 shadow-lg backdrop-blur-xl">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="font-medium">Copied to clipboard</span>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Ad Generator
                </h1>
                <p className="mt-5 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
                  High-conversion ad copy, tailored by platform, objective,
                  and audience.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/dashboard/work")}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 font-medium transition-all duration-300"
                >
                  My Work →
                </button>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 font-medium transition-all duration-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl shadow-black/40"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />

              <div className="relative space-y-8">
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-3">
                    Platform
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setPlatform(p.key)}
                        className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                          platform === p.key
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/5 border border-white/10 text-slate-300 hover:border-indigo-500/40 hover:bg-white/10"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-3">
                    Objective
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {OBJECTIVES.map((o) => (
                      <button
                        key={o}
                        onClick={() => setObjective(o)}
                        className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                          objective === o
                            ? "bg-white text-slate-900"
                            : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    What are you promoting?
                  </label>
                  <input
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. Premium custom mouthguards for fighters"
                    className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    Target audience
                  </label>
                  <input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Combat athletes aged 18–35"
                    className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex items-center justify-between gap-6 pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="relative overflow-hidden px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <span className="relative z-10">
                      {loading ? "Generating…" : "Generate Ads"}
                    </span>
                    {!loading && <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />}
                  </button>
                  {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                </div>

                <p className="text-xs text-slate-500">
                  All generated ads are automatically saved to My Work.
                </p>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-6 shadow-xl shadow-black/30">
                <p className="text-sm font-semibold text-slate-200 mb-4">
                  High-performing ad principles
                </p>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>• Lead with the core benefit</li>
                  <li>• Hook attention immediately</li>
                  <li>• One clear CTA only</li>
                  <li>• Specific beats clever</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-6 shadow-xl shadow-black/30">
                <p className="text-sm font-semibold text-slate-200 mb-4">
                  Quick actions
                </p>
                <div className="grid gap-2">
                  <button
                    onClick={copyAll}
                    disabled={!result}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <p className="text-sm font-medium text-slate-200">Copy all ad text</p>
                    <p className="text-xs text-slate-500 mt-0.5">Copy full output to clipboard</p>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/work")}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition text-left"
                  >
                    <p className="text-sm font-medium text-slate-200">Open My Work</p>
                    <p className="text-xs text-slate-500 mt-0.5">See saved ads</p>
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition text-left"
                  >
                    <p className="text-sm font-medium text-slate-200">Reset form</p>
                    <p className="text-xs text-slate-500 mt-0.5">Clear and start fresh</p>
                  </button>
                </div>
              </div>
            </motion.aside>
          </section>

          {parsedAds.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-24"
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-10">
                Ad Variations
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                {parsedAds.map((ad, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl shadow-xl shadow-black/30 overflow-hidden"
                  >
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Variation #{i + 1}
                      </p>
                      <h2 className="text-lg font-bold text-white mb-3 leading-tight">
                        {ad.headline}
                      </h2>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                        {ad.primary}
                      </p>
                      <div className="py-3 px-4 rounded-xl bg-white text-slate-900 font-semibold text-center text-sm">
                        {ad.cta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}
