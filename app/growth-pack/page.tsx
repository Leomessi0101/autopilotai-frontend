"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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

  // Paid-only image toggle (we’ll wire it later)
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
    // Keep it simple and consistent for all 3 endpoints
    return `Brand voice: ${brandVoice}\n\nBusiness/product:\n${description}\n\nRequirements:\n- Make it clear, punchy, and conversion-focused.\n- Add a simple CTA.\n`;
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

    const prompt = buildPrompt();

    try {
      setLoading(true);

      // 1) Social posts (content)
      const contentRes = await api.post("/api/content/generate", {
        title: "Growth Pack - Social Posts",
        prompt,
        generate_image: false, // text-only for now
      });

      const contentOutput = contentRes.data?.output || "";
      setSocialPosts(contentOutput);

      // 2) Email
      const emailRes = await api.post("/api/email/generate", {
        prompt,
      });

      const emailOutput = emailRes.data?.output || "";
      setEmailCopy(emailOutput);

      // 3) Ads
      const adsRes = await api.post("/api/ads/generate", {
        prompt,
      });

      const adsOutput = adsRes.data?.output || "";
      setAdCopy(adsOutput);
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

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

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
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light">
            One-Click Growth Pack
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Describe your business once. Get content, emails, and ads instantly.
          </p>
        </motion.section>

        {/* MAIN GRID */}
        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            {/* BRAND VOICE */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand Voice
              </label>
              <select
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/20 text-white"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Aggressive</option>
                <option>Luxury</option>
                <option>Startup</option>
                <option>Salesy</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder="What do you sell? Who is it for? What problem does it solve?"
                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/20 text-white resize-none focus:ring-2 focus:ring-[#6d8ce8]"
              />
            </div>

            {/* IMAGE TOGGLE (PAID ONLY) */}
            <div className="mb-6 flex items-center justify-between border border-white/20 rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Generate AI Image (Paid)
                </p>
                <p className="text-xs text-gray-400">
                  Paid feature • We’ll wire this after text works
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateImage}
                  onChange={handleToggleImage}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#6d8ce8] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>

            {showUpgradeNotice && (
              <div className="mb-6 bg-yellow-50 text-black border border-yellow-200 rounded-xl px-5 py-4">
                <p className="text-sm font-medium mb-2">
                  AI Image generation is a paid feature.
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
                className="px-10 py-4 bg-[#6d8ce8] text-black rounded-xl disabled:opacity-60 hover:bg-white"
              >
                {loading ? "Generating…" : "Generate Growth Pack"}
              </button>

              {error && <p className="text-red-400">{error}</p>}
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR (simple quick tips) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-gray-300">
                Tip: include your audience + offer + outcome.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Example: “For busy gym owners, we automate weekly content + ads
                so they get more leads without hiring an agency.”
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-gray-300">Brand voice matters.</p>
              <p className="text-xs text-gray-400 mt-3">
                “Luxury” = minimal, premium tone. “Salesy” = direct + CTA heavy.
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
            {/* SOCIAL */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Social Posts</h3>
                <button
                  onClick={() => copyText(socialPosts)}
                  className="text-sm text-[#6d8ce8] hover:text-white"
                >
                  Copy
                </button>
              </div>
              <textarea
                value={socialPosts}
                onChange={(e) => setSocialPosts(e.target.value)}
                rows={12}
                className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-sm resize-none"
              />
            </div>

            {/* EMAIL */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Email</h3>
                <button
                  onClick={() => copyText(emailCopy)}
                  className="text-sm text-[#6d8ce8] hover:text-white"
                >
                  Copy
                </button>
              </div>
              <textarea
                value={emailCopy}
                onChange={(e) => setEmailCopy(e.target.value)}
                rows={12}
                className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-sm resize-none"
              />
            </div>

            {/* ADS */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Ad Copy</h3>
                <button
                  onClick={() => copyText(adCopy)}
                  className="text-sm text-[#6d8ce8] hover:text-white"
                >
                  Copy
                </button>
              </div>
              <textarea
                value={adCopy}
                onChange={(e) => setAdCopy(e.target.value)}
                rows={12}
                className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-sm resize-none"
              />
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
