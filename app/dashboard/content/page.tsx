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

    alert("Saved to My Work");
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
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* cinematic glow bg */}
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
                Content Generator
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                Craft compelling posts — and optionally pair them with AI images.
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
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-16">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_60px_140px_rgba(0,0,0,.55)]"
          >
            {/* Title */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title / Topic (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Product announcement, mindset post, launch news"
                className="w-full px-5 py-4 rounded-2xl bg-black/25 border border-white/20 text-white focus:ring-2 focus:ring-[#6d8ce8] outline-none"
              />
            </div>

            {/* Details */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={8}
                placeholder="Platform, tone, audience, instructions…"
                className="w-full px-5 py-4 rounded-2xl bg-black/25 border border-white/20 text-white focus:ring-2 focus:ring-[#6d8ce8] resize-none outline-none"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>Tip: Include audience + goal + CTA for best results.</span>
                <span>{details.length} chars</span>
              </div>
            </div>

            {/* Templates */}
            <div className="mb-10">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Quick templates
              </p>
              <div className="flex flex-wrap gap-3">
                {quickTemplates.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setDetails(t)}
                    className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#6d8ce8]/60 hover:bg-white/10 transition text-sm"
                  >
                    {t.split(" — ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* IMAGE TOGGLE */}
            <div className="mb-6 flex items-center justify-between border border-white/15 rounded-2xl px-6 py-4 bg-black/15">
              <div>
                <p className="text-sm font-medium text-white">
                  Generate AI Image
                </p>
                <p className="text-xs text-gray-400">
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
                <div className="w-12 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[#6d8ce8] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>

            {showUpgradeNotice && (
              <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 text-black px-6 py-5">
                <p className="text-sm font-medium mb-2">
                  AI Image generation is a paid feature.
                </p>
                <p className="text-xs text-black/70 mb-4">
                  Upgrade to unlock premium image generation for your content.
                </p>
                <button
                  onClick={() =>
                    window.open("https://www.autopilotai.dev/upgrade", "_blank")
                  }
                  className="px-5 py-2 bg-[#1b2f54] text-white rounded-xl"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* STYLE SELECT (premium cards, not old dropdown) */}
            {generateImage && (
              <div className="mb-10">
                <div className="flex items-end justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Image Style
                  </label>
                  {selectedStyle && (
                    <span className="text-xs text-gray-400">
                      {selectedStyle.desc}
                    </span>
                  )}
                </div>

                <div className="grid gap-3">
                  {IMAGE_STYLES.map((s) => {
                    const active = imageStyle === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => setImageStyle(s.value)}
                        className={`text-left rounded-2xl border px-5 py-4 transition ${
                          active
                            ? "border-[#6d8ce8]/70 bg-[#6d8ce8]/15 shadow-[0_0_40px_rgba(109,140,232,.15)]"
                            : "border-white/10 bg-white/5 hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              active ? "text-white" : "text-gray-200"
                            }`}
                          >
                            {s.title}
                          </p>
                          <span
                            className={`text-xs ${
                              active ? "text-[#6d8ce8]" : "text-gray-500"
                            }`}
                          >
                            {active ? "Selected" : "Select"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{s.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {!isPaid && (
                  <p className="mt-3 text-xs text-gray-500">
                    Image styles apply when you upgrade (paid plans).
                  </p>
                )}
              </div>
            )}

            {/* CTA ROW */}
            <div className="flex items-center justify-between gap-6">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="relative px-10 py-4 bg-[#6d8ce8] text-black rounded-2xl disabled:opacity-60 hover:bg-white transition font-medium shadow-[0_20px_60px_rgba(109,140,232,.25)]"
              >
                {loading ? "Generating…" : "Generate"}
              </button>

              {error && <p className="text-red-400">{error}</p>}
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR (real now) */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="space-y-8"
          >
            {/* Premium helper */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 shadow-[0_40px_100px_rgba(0,0,0,.45)]">
              <p className="text-sm text-gray-300">
                Quality inputs = premium outputs.
              </p>
              <div className="mt-4 space-y-3 text-xs text-gray-400">
                <p>• Audience: who is this for?</p>
                <p>• Outcome: what do you want them to do?</p>
                <p>• Tone: calm, bold, luxury, casual…</p>
                <p>• Offer: what’s the value / benefit?</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-medium text-gray-200 mb-4">
                Quick actions
              </p>

              <div className="grid gap-3">
                <button
                  onClick={copyCaption}
                  disabled={!result}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-[#6d8ce8]/60 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <p className="text-sm text-gray-200">Copy caption</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Copy your generated text instantly
                  </p>
                </button>

                <button
                  onClick={() => router.push("/dashboard/work")}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-[#2b4e8d] transition text-left"
                >
                  <p className="text-sm text-gray-200">Open My Work</p>
                  <p className="text-xs text-gray-400 mt-1">
                    See saved content + images
                  </p>
                </button>

                <button
                  onClick={clearAll}
                  className="px-5 py-3 rounded-2xl bg-black/25 border border-white/10 hover:border-white/25 transition text-left"
                >
                  <p className="text-sm text-gray-200">Reset form</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Clear inputs and start fresh
                  </p>
                </button>
              </div>
            </div>

            {/* Plan */}
            <div className="rounded-3xl border border-[#2b4e8d]/40 bg-gradient-to-br from-[#111b2d] to-[#1b2f54] p-7 shadow-[0_40px_100px_rgba(0,0,0,.55)]">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Current Plan
              </p>
              <p className="text-2xl font-semibold mt-2">
                {subscriptionPlan
                  ? subscriptionPlan.charAt(0).toUpperCase() +
                    subscriptionPlan.slice(1)
                  : "Free"}
              </p>
              <p className="text-sm text-white/80 mt-3">
                {isPaid
                  ? "You have access to premium image generation."
                  : "Upgrade to unlock premium images and faster workflows."}
              </p>

              {!isPaid && (
                <button
                  onClick={() => router.push("/upgrade")}
                  className="mt-6 w-full py-3 bg-white text-[#1b2f54] rounded-2xl font-medium hover:bg-gray-200 transition"
                >
                  Upgrade
                </button>
              )}
            </div>
          </motion.aside>
        </section>

        {/* SOCIAL MEDIA PREVIEW */}
        {(result || imageUrl) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="max-w-xl mx-auto bg-white rounded-3xl border shadow-[0_40px_90px_rgba(0,0,0,.6)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1b2f54] to-[#6d8ce8]" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    autopilot.creator <span className="text-blue-500">✔</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Sponsored • Generated with AutopilotAI
                  </p>
                </div>

                <button
                  onClick={copyCaption}
                  disabled={!result}
                  className="text-xs px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-400 transition disabled:opacity-60"
                >
                  Copy
                </button>
              </div>

              {/* Image */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  className="w-full object-cover max-h-[560px]"
                  alt="AI Generated"
                />
              )}

              {/* Actions */}
              <div className="flex items-center justify-between px-5 pt-4 text-gray-700">
                <div className="flex gap-4 text-2xl">❤️ 💬 🔁</div>
                <span className="text-lg">⭐</span>
              </div>

              {/* Caption */}
              <div className="p-6">
                <p className="text-sm">
                  <span className="font-semibold mr-2 text-gray-900">
                    autopilot.creator
                  </span>
                  <span className="whitespace-pre-wrap leading-relaxed text-gray-800">
                    {result}
                  </span>
                </p>

                <p className="text-xs text-gray-500 mt-4">
                  View all 239 comments
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Posted just now • Powered by AutopilotAI
                </p>
              </div>

              {/* Buttons */}
              {imageUrl && (
                <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
                  <button
                    onClick={downloadImage}
                    className="px-6 py-2 border rounded-xl hover:border-[#1b2f54] transition"
                  >
                    Download
                  </button>

                  <button
                    onClick={saveImage}
                    className="px-6 py-2 bg-[#1b2f54] text-white rounded-xl hover:bg-[#2b4e8d] transition"
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
  );
}
