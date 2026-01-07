"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

const BRAND_VOICES = [
  "Professional",
  "Casual",
  "Aggressive",
  "Luxury",
  "Startup",
  "Salesy",
];

export default function GrowthPackPage() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [brandVoice, setBrandVoice] = useState("Professional");

  const [socialPosts, setSocialPosts] = useState("");
  const [emailCopy, setEmailCopy] = useState("");
  const [adCopy, setAdCopy] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [generateImage, setGenerateImage] = useState(false);
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);

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

  const buildPrompt = () => {
    return `Brand voice: ${brandVoice}

Business / product:
${description}

Requirements:
- Clear value
- Strong structure
- Conversion-focused
- Natural CTA`;
  };

  const handleToggleImage = () => {
    if (!isPaid) {
      setShowUpgradeNotice(true);
      setGenerateImage(false);
      return;
    }
    setGenerateImage((v) => !v);
  };

  const handleGenerate = async () => {
    setError("");
    setSocialPosts("");
    setEmailCopy("");
    setAdCopy("");

    if (!description.trim()) {
      setError("Please describe your business or product.");
      return;
    }

    try {
      setLoading(true);
      const prompt = buildPrompt();

      const contentRes = await api.post("/api/content/generate", {
        title: "Growth Pack – Social",
        prompt,
        generate_image: false,
      });

      const emailRes = await api.post("/api/email/generate", { prompt });
      const adsRes = await api.post("/api/ads/generate", { prompt });

      setSocialPosts(contentRes.data?.output || "");
      setEmailCopy(emailRes.data?.output || "");
      setAdCopy(adsRes.data?.output || "");
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          e?.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* cinematic glow */}
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
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            One-Click Growth Pack
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Generate social posts, emails, and ads in one pass — tuned to your
            brand voice.
          </p>
        </motion.section>

        {/* MAIN GRID */}
        <section className="grid gap-12 lg:grid-cols-[1fr,360px] mb-24">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_60px_140px_rgba(0,0,0,.6)]"
          >
            {/* BRAND VOICE PILLS */}
            <div className="mb-10">
              <p className="text-sm text-gray-400 mb-4">
                Choose a brand voice
              </p>
              <div className="flex flex-wrap gap-3">
                {BRAND_VOICES.map((v) => {
                  const active = brandVoice === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setBrandVoice(v)}
                      className={`px-5 py-2 rounded-full text-sm transition-all
                        ${
                          active
                            ? "bg-[#6d8ce8] text-black shadow-[0_0_30px_rgba(109,140,232,.6)]"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Business description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder="Who is it for, what problem it solves, and why it’s better…"
                className="w-full px-6 py-5 rounded-2xl bg-black/30 border border-white/20 text-white resize-none focus:ring-2 focus:ring-[#6d8ce8]"
              />
            </div>

            {/* IMAGE TOGGLE */}
            <div className="mb-8 flex items-center justify-between border border-white/20 rounded-2xl px-6 py-4 bg-black/20">
              <div>
                <p className="text-sm font-medium">AI Image (Paid)</p>
                <p className="text-xs text-gray-400">
                  Premium add-on for visuals
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateImage}
                  onChange={handleToggleImage}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[#6d8ce8] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>

            {showUpgradeNotice && (
              <div className="mb-6 bg-yellow-50 text-black border border-yellow-200 rounded-2xl px-6 py-4">
                <p className="text-sm font-medium mb-2">
                  AI image generation is a paid feature.
                </p>
                <button
                  onClick={() =>
                    window.open("https://www.autopilotai.dev/upgrade", "_blank")
                  }
                  className="px-5 py-2 bg-[#1b2f54] text-white rounded-lg"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-12 py-4 bg-[#6d8ce8] text-black rounded-2xl text-lg font-medium hover:bg-white disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate Growth Pack"}
              </button>

              {error && <p className="text-red-400">{error}</p>}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="space-y-8"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-gray-300">
                Strong inputs = better output.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Include audience, offer, and outcome for best results.
              </p>
            </div>
          </motion.div>
        </section>

        {/* RESULTS */}
        {(socialPosts || emailCopy || adCopy) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid gap-10 lg:grid-cols-3"
          >
            {[
              ["Social Posts", socialPosts, setSocialPosts],
              ["Email", emailCopy, setEmailCopy],
              ["Ad Copy", adCopy, setAdCopy],
            ].map(([title, value, setter]: any) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{title}</h3>
                  <button
                    onClick={() => copyText(value)}
                    className="text-sm text-[#6d8ce8] hover:text-white"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  rows={12}
                  className="w-full bg-black/30 border border-white/20 rounded-2xl p-4 text-sm resize-none"
                />
              </div>
            ))}
          </motion.section>
        )}
      </main>
    </div>
  );
}
