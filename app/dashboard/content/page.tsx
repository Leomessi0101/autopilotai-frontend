"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

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

  const [imageStyle, setImageStyle] = useState("clean");

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
        e?.response?.data?.detail ||
          "Something went wrong. Please try again."
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

  const quickTemplates = [
    "Instagram caption — short, confident, benefit-focused with CTA",
    "LinkedIn post — professional, value-driven, thought leadership tone",
    "Twitter/X thread — engaging hook, clear value, strong close",
    "Product description — persuasive, benefit-oriented, premium feel",
    "YouTube script intro — high-energy hook for the first 10 seconds",
  ];

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">

      {/* Cinematic Background */}
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
          <h1 className="text-5xl md:text-6xl font-light text-white">
            Content Generator
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Craft compelling posts and optionally generate a matching AI image.
          </p>
        </motion.section>

        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title or topic (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New product launch"
                className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#6d8ce8]"
              />
            </div>

            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={8}
                placeholder="Platform, tone, audience, instructions…"
                className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#6d8ce8] resize-none"
              />
            </div>

            {/* IMAGE TOGGLE */}
            <div className="mb-6 flex items-center justify-between border border-white/10 rounded-xl px-5 py-4 bg-white/5">
              <div>
                <p className="text-sm font-medium text-gray-200">
                  Generate AI Image
                </p>
                <p className="text-xs text-gray-400">
                  Paid feature • Only 1 post when enabled
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateImage}
                  onChange={handleToggle}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#6d8ce8] after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>

            {/* UPGRADE */}
            {showUpgradeNotice && (
              <div className="mb-6 bg-yellow-300/10 border border-yellow-300/30 text-yellow-200 rounded-xl px-5 py-4">
                <p className="text-sm font-medium mb-2">
                  AI Image generation is a paid feature.
                </p>
                <button
                  onClick={() =>
                    window.open("https://www.autopilotai.dev/upgrade", "_blank")
                  }
                  className="px-5 py-2 bg-white text-black rounded-lg"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* IMAGE STYLE */}
            {generateImage && (
              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Style
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 text-white border border-white/20"
                >
                  <option className="text-black" value="clean">Clean Corporate</option>
                  <option className="text-black" value="cinematic">Cinematic Realistic</option>
                  <option className="text-black" value="minimal">Minimal Illustration</option>
                  <option className="text-black" value="social">Social Media Thumbnail</option>
                  <option className="text-black" value="product">Product Showcase</option>
                </select>
              </div>
            )}

            <div className="mb-8 flex flex-wrap gap-3">
              {quickTemplates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setDetails(t)}
                  className="px-5 py-3 rounded-xl bg-white/10 text-gray-200 hover:bg-white/20 transition"
                >
                  {t.split(" — ")[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-white text-black rounded-xl disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate"}
              </button>

              {error && <p className="text-red-400">{error}</p>}
            </div>
          </motion.div>

          {/* Right sidebar vibes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-gray-200 space-y-6 shadow-[0_50px_120px_rgba(0,0,0,.5)]"
          >
            <h3 className="text-xl font-semibold">Tips</h3>
            <p className="text-gray-300">
              Be clear with goal, audience and tone for better output.
            </p>
          </motion.div>
        </section>

        {/* RESULT SECTION */}
        {(result || imageUrl) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg overflow-hidden">

              {/* Image */}
              {imageUrl && (
                <img src={imageUrl} className="w-full object-cover border-b border-white/10" />
              )}

              {/* Caption */}
              <div className="p-6">
                <p className="whitespace-pre-wrap leading-relaxed text-gray-100 text-sm">
                  {result}
                </p>
              </div>

              {/* Buttons */}
              {imageUrl && (
                <div className="flex justify-end gap-4 p-4">
                  <button
                    onClick={downloadImage}
                    className="px-6 py-2 border border-white/20 rounded-xl"
                  >
                    Download
                  </button>

                  <button
                    onClick={saveImage}
                    className="px-6 py-2 bg-white text-black rounded-xl"
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
