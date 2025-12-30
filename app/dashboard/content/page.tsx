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

    api.get("/api/auth/me")
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
        image_style: imageStyle
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
      image_style: imageStyle
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-800">
            Content Generator
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Craft compelling posts and optionally generate a matching AI image.
          </p>
        </motion.section>

        <section className="grid gap-10 lg:grid-cols-[1fr,380px] mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10"
          >
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title or topic (optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New product launch"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={8}
                placeholder="Platform, tone, audience, instructions…"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 resize-none"
              />
            </div>

            {/* IMAGE TOGGLE */}
            <div className="mb-6 flex items-center justify-between border rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Generate AI Image
                </p>
                <p className="text-xs text-gray-500">
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
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-900 after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>

            {/* UPGRADE */}
            {showUpgradeNotice && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
                <p className="text-sm font-medium mb-2">
                  AI Image generation is a paid feature.
                </p>
                <button
                  onClick={() => window.open("https://www.autopilotai.dev/upgrade", "_blank")}
                  className="px-5 py-2 bg-blue-900 text-white rounded-lg"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* IMAGE STYLE */}
            {generateImage && (
              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Image Style
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200"
                >
                  <option value="clean">Clean Corporate</option>
                  <option value="cinematic">Cinematic Realistic</option>
                  <option value="minimal">Minimal Illustration</option>
                  <option value="social">Social Media Thumbnail</option>
                  <option value="product">Product Showcase</option>
                </select>
              </div>
            )}

            <div className="mb-8 flex flex-wrap gap-3">
              {quickTemplates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setDetails(t)}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-blue-50"
                >
                  {t.split(" — ")[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-blue-900 text-white rounded-xl disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate"}
              </button>

              {error && <p className="text-red-600">{error}</p>}
            </div>
          </motion.div>

          {/* SIDE INFO unchanged */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* same sidebar as before */}
          </motion.div>
        </section>

        {/* RESULT */}
        {(result || imageUrl) && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl border shadow-sm p-12">

              {result && (
                <div className="bg-gray-50 rounded-xl p-10 mb-10">
                  <pre className="whitespace-pre-wrap text-gray-800">{result}</pre>
                </div>
              )}

              {imageUrl && (
                <>
                  <img src={imageUrl} className="rounded-xl border mb-6" />

                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={downloadImage}
                      className="px-8 py-3 border rounded-xl"
                    >
                      Download
                    </button>

                    <button
                      onClick={saveImage}
                      className="px-8 py-3 bg-blue-900 text-white rounded-xl"
                    >
                      Save to My Work
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
