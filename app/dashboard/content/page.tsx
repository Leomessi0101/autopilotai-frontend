"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

const IMAGE_STYLES = [
  {
    value: "clean",
    title: "Clean Corporate",
    desc: "Modern SaaS visuals, crisp lighting, premium look.",
  },
  {
    value: "cinematic",
    title: "Cinematic",
    desc: "Moody, dramatic lighting, high contrast, film feel.",
  },
  {
    value: "minimal",
    title: "Minimal Illustration",
    desc: "Simple shapes, clean composition, subtle detail.",
  },
  {
    value: "social",
    title: "Social Thumbnail",
    desc: "Bold framing, attention-grabbing, feed-friendly.",
  },
  {
    value: "product",
    title: "Product Showcase",
    desc: "Hero product lighting, clean scene, premium vibe.",
  },
] as const;

export default function ContentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [generateImage, setGenerateImage] = useState(false);
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);

  const [imageStyle, setImageStyle] = useState<(typeof IMAGE_STYLES)[number]["value"]>("clean");
  const [saveToast, setSaveToast] = useState(false);

  const isPaid = useMemo(() => {
    return !!subscriptionPlan && subscriptionPlan !== "free";
  }, [subscriptionPlan]);

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

  const handleToggle = () => {
    if (!subscriptionPlan || subscriptionPlan === "free") {
      setShowUpgradeNotice(true);
      setGenerateImage(false);
      return;
    }
    setGenerateImage(!generateImage);
  };

  const handleGenerate = async () => {
    setError("");
    setResult("");
    setImageUrl(null);

    if (!details.trim()) {
      setError("Please describe the content you’d like to create.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/content/generate", {
        title: title || undefined,
        prompt: details,
        generate_image: generateImage,
        image_style: imageStyle,
      });

      let output = res.data.output || "";
      const posts = output.split(/\n\s*\n/);

      const imageBlocked =
        res.data?.error?.toLowerCase()?.includes("paid") ||
        res.data?.error?.toLowerCase()?.includes("upgrade");

      if (generateImage && !imageBlocked) {
        setResult(posts.slice(0, 1).join("\n\n"));
        setImageUrl(res.data.image || null);
      } else {
        setResult(posts.slice(0, 3).join("\n\n"));
        setImageUrl(null);
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveImage = async () => {
    if (!imageUrl) return;

    await api.post("/api/images/save", {
      image_url: imageUrl,
      text_content: result,
      image_style: imageStyle,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "autopilotai-image.png";
    a.click();
  };

  const copyCaption = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  const clearAll = () => {
    setTitle("");
    setDetails("");
    setResult("");
    setImageUrl(null);
    setError("");
    setShowUpgradeNotice(false);
    setGenerateImage(false);
    setImageStyle("clean");
  };

  const quickTemplates = [
    "Instagram caption — short, confident, benefit-focused with CTA",
    "LinkedIn post — professional, value-driven, thought leadership tone",
    "Twitter/X thread — engaging hook, clear value, strong close",
    "Product description — persuasive, benefit-oriented, premium feel",
    "YouTube script intro — high-energy hook for the first 10 seconds",
  ];

  const selectedStyle = IMAGE_STYLES.find((s) => s.value === imageStyle);

  return (
    <div className="min-h-screen bg-[#050810] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b06_1px,transparent_1px),linear-gradient(to_bottom,#1e293b06_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {saveToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500/95 text-white border border-emerald-400/30 shadow-lg backdrop-blur-xl">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <span className="font-medium">Saved to My Work</span>
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
                Content Generator
              </h1>
              <p className="mt-5 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
                Craft compelling posts — and optionally pair them with AI images.
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

        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-16">
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
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Title / Topic (optional)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product announcement, mindset post, launch news"
                  className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={8}
                  placeholder="Platform, tone, audience, instructions…"
                  className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 resize-none focus:outline-none transition-all duration-300"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Tip: Include audience + goal + CTA for best results.</span>
                  <span className="tabular-nums font-medium">{details.length} chars</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-400 mb-3">
                  Quick templates
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setDetails(t)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 text-sm text-slate-200 font-medium transition-all duration-300"
                    >
                      {t.split(" — ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Generate AI Image
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Paid feature • Shows only 1 caption when enabled
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateImage}
                    onChange={handleToggle}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-600 rounded-full peer peer-checked:bg-indigo-500 after:absolute after:top-[3px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6 after:shadow-md" />
                </label>
              </div>

              {showUpgradeNotice && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-5">
                  <p className="text-sm font-semibold text-amber-200 mb-1">
                    AI Image generation is a paid feature.
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Upgrade to unlock premium image generation for your content.
                  </p>
                  <button
                    onClick={() => router.push("/upgrade")}
                    className="px-5 py-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-200 rounded-xl font-medium hover:bg-amber-500/30 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                </div>
              )}

              {generateImage && (
                <div>
                  <div className="flex items-end justify-between mb-3">
                    <label className="block text-sm font-semibold text-slate-400">
                      Image Style
                    </label>
                    {selectedStyle && (
                      <span className="text-xs text-slate-500">
                        {selectedStyle.desc}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {IMAGE_STYLES.map((s) => {
                      const active = imageStyle === s.value;
                      return (
                        <button
                          key={s.value}
                          onClick={() => setImageStyle(s.value)}
                          className={`text-left rounded-2xl border px-5 py-4 transition-all duration-300 ${
                            active
                              ? "border-indigo-500/60 bg-indigo-500/15 shadow-[0_0_30px_rgba(99,102,241,.2)]"
                              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${active ? "text-white" : "text-slate-200"}`}>
                              {s.title}
                            </p>
                            <span className={`text-xs ${active ? "text-indigo-400" : "text-slate-500"}`}>
                              {active ? "Selected" : "Select"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">{s.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                  {!isPaid && (
                    <p className="mt-3 text-xs text-slate-500">
                      Image styles apply when you upgrade (paid plans).
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-6 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="relative overflow-hidden px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                >
                  <span className="relative z-10">
                    {loading ? "Generating…" : "Generate"}
                  </span>
                  {!loading && <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />}
                </button>
                {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-6 shadow-xl shadow-black/30">
              <p className="text-sm font-semibold text-slate-200 mb-3">
                Quality inputs = premium outputs.
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Audience: who is this for?</li>
                <li>• Outcome: what do you want them to do?</li>
                <li>• Tone: calm, bold, luxury, casual…</li>
                <li>• Offer: what’s the value / benefit?</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-2xl p-6 shadow-xl shadow-black/30">
              <p className="text-sm font-semibold text-slate-200 mb-4">
                Quick actions
              </p>
              <div className="grid gap-2">
                <button
                  onClick={copyCaption}
                  disabled={!result}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <p className="text-sm font-medium text-slate-200">Copy caption</p>
                  <p className="text-xs text-slate-500 mt-0.5">Copy your generated text instantly</p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/work")}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition text-left"
                >
                  <p className="text-sm font-medium text-slate-200">Open My Work</p>
                  <p className="text-xs text-slate-500 mt-0.5">See saved content + images</p>
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition text-left"
                >
                  <p className="text-sm font-medium text-slate-200">Reset form</p>
                  <p className="text-xs text-slate-500 mt-0.5">Clear inputs and start fresh</p>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-indigo-950/40 p-6 shadow-xl shadow-black/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current Plan
              </p>
              <p className="text-xl font-bold text-white mt-2">
                {subscriptionPlan ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1) : "Free"}
              </p>
              <p className="text-sm text-slate-300 mt-2">
                {isPaid
                  ? "You have access to premium image generation."
                  : "Upgrade to unlock premium images and faster workflows."}
              </p>
              {!isPaid && (
                <button
                  onClick={() => router.push("/upgrade")}
                  className="mt-5 w-full py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                >
                  Upgrade
                </button>
              )}
            </div>
          </motion.aside>
        </section>

        {(result || imageUrl) && (
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">
                    autopilot.creator <span className="text-indigo-400">✔</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Sponsored • Generated with AutopilotAI
                  </p>
                </div>
                <button
                  onClick={copyCaption}
                  disabled={!result}
                  className="text-xs px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 text-slate-200 font-medium transition disabled:opacity-50"
                >
                  Copy
                </button>
              </div>

              {imageUrl && (
                <img
                  src={imageUrl}
                  className="w-full object-cover max-h-[560px]"
                  alt="AI Generated"
                />
              )}

              <div className="flex items-center justify-between px-5 py-4 text-slate-400">
                <div className="flex gap-5 text-xl">❤️ 💬 🔁</div>
                <span className="text-lg">⭐</span>
              </div>

              <div className="px-6 pb-6">
                <p className="text-sm">
                  <span className="font-semibold mr-2 text-white">autopilot.creator</span>
                  <span className="whitespace-pre-wrap leading-relaxed text-slate-300">{result}</span>
                </p>
                <p className="text-xs text-slate-500 mt-4">View all 239 comments</p>
                <p className="text-xs text-slate-600 mt-1">Posted just now • Powered by AutopilotAI</p>
              </div>

              {imageUrl && (
                <div className="flex justify-end gap-3 p-5 border-t border-white/10 bg-black/20">
                  <button
                    onClick={downloadImage}
                    className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-200 font-medium hover:bg-white/10 transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={saveImage}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
                  >
                    Save to My Work
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </main>
      </div>
    </div>
  );
}
