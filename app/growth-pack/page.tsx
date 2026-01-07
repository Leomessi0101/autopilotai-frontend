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
  const [adImage, setAdImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [name, setName] = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [generateImage, setGenerateImage] = useState(false);
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);

  const isPaid = useMemo(
    () => !!subscriptionPlan && subscriptionPlan !== "free",
    [subscriptionPlan]
  );

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

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    setAdImage(null);

    try {
      const res = await api.post("/api/growth-pack/generate", {
        prompt: buildPrompt(),
        generate_image: generateImage,
      });

      setSocialPosts(res.data.content || "");
      setEmailCopy(res.data.email || "");
      setAdCopy(res.data.ads || "");
      setAdImage(res.data.image || null);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          e?.response?.data?.error ||
          "Generation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const regenerateSection = async (section: "social" | "email" | "ads") => {
    setRegenLoading(section);
    setError("");

    try {
      const res = await api.post("/api/growth-pack/regenerate", {
        section,
        prompt: buildPrompt(),
        generate_image: section === "ads" ? generateImage : false,
      });

      if (section === "social") setSocialPosts(res.data.output);
      if (section === "email") setEmailCopy(res.data.output);
      if (section === "ads") {
        setAdCopy(res.data.output);
        setAdImage(res.data.image || null);
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          e?.response?.data?.error ||
          "Regeneration failed."
      );
    } finally {
      setRegenLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
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
            One-Click Growth Pack
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Generate social posts, emails, and ads in one premium pass.
          </p>
        </motion.section>

        {/* Input */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 mb-16">
          <div className="mb-8 flex flex-wrap gap-3">
            {BRAND_VOICES.map((v) => (
              <button
                key={v}
                onClick={() => setBrandVoice(v)}
                className={`px-5 py-2 rounded-full text-sm transition
                  ${
                    brandVoice === v
                      ? "bg-[#6d8ce8] text-black"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe your business, audience, and offer..."
            className="w-full bg-black/30 border border-white/20 rounded-2xl p-6 resize-none"
          />

          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={generateImage}
                onChange={() =>
                  isPaid
                    ? setGenerateImage(!generateImage)
                    : setShowUpgradeNotice(true)
                }
              />
              Generate AI image for ads (paid)
            </label>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-10 py-4 bg-[#6d8ce8] text-black rounded-2xl hover:bg-white"
            >
              {loading ? "Generating…" : "Generate Growth Pack"}
            </button>
          </div>

          {error && <p className="mt-4 text-red-400">{error}</p>}
        </div>

        {/* Results */}
        {(socialPosts || emailCopy || adCopy) && (
          <div className="grid gap-10 lg:grid-cols-3">
            {[
              ["Social Posts", socialPosts, "social"],
              ["Email", emailCopy, "email"],
              ["Ads", adCopy, "ads"],
            ].map(([title, value, key]: any) => (
              <div
                key={key}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg">{title}</h3>
                  <button
                    onClick={() => regenerateSection(key)}
                    disabled={regenLoading === key}
                    className="text-sm text-[#6d8ce8]"
                  >
                    {regenLoading === key ? "Regenerating…" : "Regenerate"}
                  </button>
                </div>

                <textarea
                  value={value}
                  onChange={(e) => {
                    if (key === "social") setSocialPosts(e.target.value);
                    if (key === "email") setEmailCopy(e.target.value);
                    if (key === "ads") setAdCopy(e.target.value);
                  }}
                  rows={12}
                  className="w-full bg-black/30 border border-white/20 rounded-2xl p-4 resize-none"
                />

                {key === "ads" && adImage && (
                  <img
                    src={adImage}
                    className="mt-4 rounded-xl border border-white/10"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
